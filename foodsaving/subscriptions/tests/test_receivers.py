import json
import os
import pathlib
from shutil import copyfile

import requests_mock
from channels.test import ChannelTestCase, WSClient
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.core.management import call_command
from django.utils import timezone
from pyfcm.baseapi import BaseAPI as FCMApi

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.conversations.models import ConversationMessage
from foodsaving.groups.factories import GroupFactory
from foodsaving.invitations.models import Invitation
from foodsaving.pickups.factories import PickupDateFactory, PickupDateSeriesFactory, FeedbackFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.subscriptions.models import PushSubscriptionPlatform, PushSubscription, ChannelSubscription
from foodsaving.tests.utils import ReceiveAllWSClient
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


class ConversationReceiverTests(ChannelTestCase):
    def test_receives_messages(self):
        client = WSClient()
        user = UserFactory()
        author_client = WSClient()
        author = UserFactory()

        # join a conversation
        conversation = ConversationFactory()
        conversation.join(user)
        conversation.join(author)

        # login and connect
        client.force_login(user)
        client.send_and_consume('websocket.connect', path='/')
        author_client.force_login(author)
        author_client.send_and_consume('websocket.connect', path='/')

        # add a message to the conversation
        message = ConversationMessage.objects.create(conversation=conversation, content='yay', author=author)

        # hopefully they receive it!
        response = client.receive(json=True)
        response['payload']['created_at'] = parse(response['payload']['created_at'])
        self.assertEqual(response, {
            'topic': 'conversations:message',
            'payload': {
                'id': message.id,
                'content': message.content,
                'author': message.author.id,
                'conversation': conversation.id,
                'created_at': message.created_at
            }
        })

        # and they should get an updated conversation object
        response = client.receive(json=True)
        response['payload']['created_at'] = parse(response['payload']['created_at'])
        response['payload']['updated_at'] = parse(response['payload']['updated_at'])
        del response['payload']['participants']
        self.assertEqual(response, {
            'topic': 'conversations:conversation',
            'payload': {
                'id': conversation.id,
                'created_at': conversation.created_at,
                'updated_at': conversation.updated_at,
                'seen_up_to': None,
                'unread_message_count': 1,
            }
        })

        # author should get message & updated conversations object too
        response = author_client.receive(json=True)
        response['payload']['created_at'] = parse(response['payload']['created_at'])
        self.assertEqual(response, {
            'topic': 'conversations:message',
            'payload': {
                'id': message.id,
                'content': message.content,
                'author': message.author.id,
                'conversation': conversation.id,
                'created_at': message.created_at
            }
        })

        # Author receives more recent `update_at` time,
        # because their `seen_up_to` status is set after sending the message.
        author_participant = conversation.conversationparticipant_set.get(user=author)
        response = author_client.receive(json=True)
        response['payload']['created_at'] = parse(response['payload']['created_at'])
        response['payload']['updated_at'] = parse(response['payload']['updated_at'])
        del response['payload']['participants']
        self.assertEqual(response, {
            'topic': 'conversations:conversation',
            'payload': {
                'id': conversation.id,
                'created_at': conversation.created_at,
                'updated_at': author_participant.updated_at,
                'seen_up_to': message.id,
                'unread_message_count': 0,
            }
        })

    def tests_receive_message_on_leave(self):
        client = WSClient()
        user = UserFactory()

        # join a conversation
        conversation = ConversationFactory()
        conversation.join(user)

        # login and connect
        client.force_login(user)
        client.send_and_consume('websocket.connect', path='/')

        conversation.leave(user)

        self.assertEqual(client.receive(json=True), {
            'topic': 'conversations:leave',
            'payload': {
                'id': conversation.id
            }
        })


class GroupReceiverTests(ChannelTestCase):
    def setUp(self):
        self.client = WSClient()
        self.member = UserFactory()
        self.user = UserFactory()
        self.group = GroupFactory(members=[self.member])

    def test_receive_group_changes(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        name = faker.name()
        self.group.name = name
        self.group.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'groups:group_detail')
        self.assertEqual(response['payload']['name'], name)
        self.assertTrue('description' in response['payload'])

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'groups:group_preview')
        self.assertEqual(response['payload']['name'], name)
        self.assertTrue('description' not in response['payload'])

        self.assertIsNone(self.client.receive(json=True))

    def test_receive_group_changes_as_nonmember(self):
        self.client.force_login(self.user)
        self.client.send_and_consume('websocket.connect', path='/')

        name = faker.name()
        self.group.name = name
        self.group.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'groups:group_preview')
        self.assertEqual(response['payload']['name'], name)
        self.assertTrue('description' not in response['payload'])

        self.assertIsNone(self.client.receive(json=True))


class InvitationReceiverTests(ChannelTestCase):
    def setUp(self):
        self.client = ReceiveAllWSClient()
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member])

    def test_receive_invitation_updates(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        invitation = Invitation.objects.create(
            email='bla@bla.com',
            group=self.group,
            invited_by=self.member
        )

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'invitations:invitation')
        self.assertEqual(response['payload']['email'], invitation.email)

        self.assertIsNone(self.client.receive(json=True))

    def test_receive_invitation_accept(self):
        invitation = Invitation.objects.create(
            email='bla@bla.com',
            group=self.group,
            invited_by=self.member
        )
        user = UserFactory()

        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        id = invitation.id
        invitation.accept(user)

        response = next(r for r in self.client.receive_all(json=True) if r['topic'] == 'invitations:invitation_accept')
        self.assertEqual(response['payload']['id'], id)


class StoreReceiverTests(ChannelTestCase):
    def setUp(self):
        self.client = WSClient()
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member])
        self.store = StoreFactory(group=self.group)

    def test_receive_store_changes(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        name = faker.name()
        self.store.name = name
        self.store.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'stores:store')
        self.assertEqual(response['payload']['name'], name)

        self.assertIsNone(self.client.receive(json=True))


class PickupDateReceiverTests(ChannelTestCase):
    def setUp(self):
        self.client = WSClient()
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member])
        self.store = StoreFactory(group=self.group)
        self.pickup = PickupDateFactory(store=self.store)

    def test_receive_pickup_changes(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        # change property
        date = faker.future_datetime(end_date='+30d', tzinfo=timezone.utc)
        self.pickup.date = date
        self.pickup.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'pickups:pickupdate')
        self.assertEqual(parse(response['payload']['date']), date)

        # join
        self.pickup.collectors.add(self.member)

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'pickups:pickupdate')
        self.assertEqual(response['payload']['collector_ids'], [self.member.id])

        # leave
        self.pickup.collectors.remove(self.member)

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'pickups:pickupdate')
        self.assertEqual(response['payload']['collector_ids'], [])

        self.assertIsNone(self.client.receive(json=True))

    def test_receive_pickup_delete(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        self.pickup.deleted = True
        self.pickup.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'pickups:pickupdate_deleted')
        self.assertEqual(response['payload']['id'], self.pickup.id)

        self.assertIsNone(self.client.receive(json=True))


class PickupDateSeriesReceiverTests(ChannelTestCase):
    def setUp(self):
        self.client = WSClient()
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member])
        self.store = StoreFactory(group=self.group)

        # Create far in the future to generate no pickup dates
        # They would lead to interfering websocket messages
        self.series = PickupDateSeriesFactory(store=self.store, start_date=timezone.now() + relativedelta(months=2))

    def test_receive_series_changes(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        date = faker.future_datetime(end_date='+30d', tzinfo=timezone.utc) + relativedelta(months=2)
        self.series.start_date = date
        self.series.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'pickups:series')
        self.assertEqual(parse(response['payload']['start_date']), date)

        self.assertIsNone(self.client.receive(json=True))

    def test_receive_series_delete(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        id = self.series.id
        self.series.delete()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'pickups:series_deleted')
        self.assertEqual(response['payload']['id'], id)

        self.assertIsNone(self.client.receive(json=True))


class FeedbackReceiverTests(ChannelTestCase):
    def setUp(self):
        self.client = WSClient()
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member])
        self.store = StoreFactory(group=self.group)
        self.pickup = PickupDateFactory(store=self.store)

    def test_receive_feedback_changes(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        feedback = FeedbackFactory(given_by=self.member, about=self.pickup)

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'feedback:feedback')
        self.assertEqual(response['payload']['weight'], feedback.weight)

        self.assertIsNone(self.client.receive(json=True))


class FinishedPickupReceiverTest(ChannelTestCase):
    def setUp(self):
        self.client = WSClient()
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member])
        self.store = StoreFactory(group=self.group)
        self.pickup = PickupDateFactory(store=self.store, collectors=[self.member])

    def test_receive_feedback_possible_and_history(self):
        self.pickup.date = timezone.now() - relativedelta(days=1)
        self.pickup.save()

        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')
        call_command('process_finished_pickup_dates')

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'history:history')
        self.assertEqual(response['payload']['typus'], 'PICKUP_DONE')

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'pickups:feedback_possible')
        self.assertEqual(response['payload']['id'], self.pickup.id)

        self.assertIsNone(self.client.receive(json=True))


class UserReceiverTest(ChannelTestCase):
    def setUp(self):
        self.client = WSClient()
        self.member = UserFactory()
        self.other_member = UserFactory()
        self.unrelated_user = UserFactory()
        self.group = GroupFactory(members=[self.member, self.other_member])
        pathlib.Path(settings.MEDIA_ROOT).mkdir(exist_ok=True)
        copyfile(os.path.join(os.path.dirname(__file__), './photo.jpg'),
                 os.path.join(settings.MEDIA_ROOT, 'photo.jpg'))
        self.member.photo = 'photo.jpg'
        self.member.save()
        self.other_member.photo = 'photo.jpg'
        self.other_member.save()

    def test_receive_own_user_changes(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        name = faker.name()
        self.member.display_name = name
        self.member.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'auth:user')
        self.assertEqual(response['payload']['display_name'], name)
        self.assertTrue('current_group' in response['payload'])
        self.assertTrue(response['payload']['photo_urls']['full_size'].startswith(settings.HOSTNAME))

        self.assertIsNone(self.client.receive(json=True))

    def test_receive_changes_of_other_user(self):
        self.client.force_login(self.member)
        self.client.send_and_consume('websocket.connect', path='/')

        name = faker.name()
        self.other_member.display_name = name
        self.other_member.save()

        response = self.client.receive(json=True)
        self.assertEqual(response['topic'], 'users:user')
        self.assertEqual(response['payload']['display_name'], name)
        self.assertTrue('current_group' not in response['payload'])
        self.assertTrue(response['payload']['photo_urls']['full_size'].startswith(settings.HOSTNAME))

        self.assertIsNone(self.client.receive(json=True))

    def test_unrelated_user_receives_no_changes(self):
        self.client.force_login(self.unrelated_user)
        self.client.send_and_consume('websocket.connect', path='/')

        self.member.display_name = faker.name()
        self.member.save()

        self.assertIsNone(self.client.receive(json=True))


@requests_mock.Mocker()
class ReceiverPushTests(ChannelTestCase):
    def setUp(self):
        self.user = UserFactory()
        self.author = UserFactory()

        self.token = faker.uuid4()
        self.content = faker.text()

        # join a conversation
        self.conversation = ConversationFactory()
        self.conversation.join(self.user)
        self.conversation.join(self.author)

        # add a push subscriber
        PushSubscription.objects.create(user=self.user, token=self.token, platform=PushSubscriptionPlatform.ANDROID)

    def test_sends_to_push_subscribers(self, m):
        def check_json_data(request):
            data = json.loads(request.body.decode('utf-8'))
            self.assertEqual(data['notification']['title'], self.author.display_name)
            self.assertEqual(data['notification']['body'], self.content)
            self.assertEqual(data['to'], self.token)
            return True

        m.post(FCMApi.FCM_END_POINT, json={}, additional_matcher=check_json_data)

        # add a message to the conversation
        ConversationMessage.objects.create(conversation=self.conversation, content=self.content, author=self.author)

    def test_does_not_send_push_notification_if_active_channel_subscription(self, m):
        # add a channel subscription to prevent the push being sent
        ChannelSubscription.objects.create(user=self.user, reply_channel='foo')
        # add a message to the conversation
        ConversationMessage.objects.create(conversation=self.conversation, content=self.content, author=self.author)
        # if it sent a push message, the requests mock would complain there is no matching request...

    def test_send_push_notification_if_channel_subscription_is_away(self, m):
        def check_json_data(request):
            data = json.loads(request.body.decode('utf-8'))
            self.assertEqual(data['notification']['title'], self.author.display_name)
            self.assertEqual(data['notification']['body'], self.content)
            self.assertEqual(data['to'], self.token)
            return True

        m.post(FCMApi.FCM_END_POINT, json={}, additional_matcher=check_json_data)

        # add a channel subscription to prevent the push being sent
        ChannelSubscription.objects.create(user=self.user, reply_channel='foo', away_at=timezone.now())

        # add a message to the conversation
        ConversationMessage.objects.create(conversation=self.conversation, content=self.content, author=self.author)


@requests_mock.Mocker()
class GroupConversationReceiverPushTests(ChannelTestCase):
    def setUp(self):
        self.group = GroupFactory()
        self.user = UserFactory()
        self.author = UserFactory()
        self.group.add_member(self.user)
        self.group.add_member(self.author)

        self.token = faker.uuid4()
        self.content = faker.text()

        self.conversation = self.group.conversation

        # add a push subscriber
        PushSubscription.objects.create(user=self.user, token=self.token, platform=PushSubscriptionPlatform.ANDROID)

    def test_sends_to_push_subscribers(self, m):
        def check_json_data(request):
            data = json.loads(request.body.decode('utf-8'))
            self.assertEqual(data['notification']['title'], self.group.name + ' / ' + self.author.display_name)
            self.assertEqual(data['notification']['body'], self.content)
            self.assertEqual(data['to'], self.token)
            return True

        m.post(FCMApi.FCM_END_POINT, json={}, additional_matcher=check_json_data)

        # add a message to the conversation
        ConversationMessage.objects.create(conversation=self.conversation, content=self.content, author=self.author)
