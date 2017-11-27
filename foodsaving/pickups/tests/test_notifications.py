import json

import responses
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.users.factories import UserFactory
from foodsaving.pickups.factories import PickupDateFactory


def parse(body):
    return json.loads(body.decode('utf-8'))


class TestNotificationsDisabled(APITestCase):
    def setUp(self):
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.store = StoreFactory(group=self.group)
        self.pickup = PickupDateFactory(store=self.store)

    @responses.activate
    def test_send_no_upcoming_notification_if_no_webhook(self):
        self.group.send_notifications()


class TestNotificationsEnabled(APITestCase):
    def setUp(self):
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ],
                                  slack_webhook='https://hooks.slack.com/services/some_webhook')
        self.store = StoreFactory(group=self.group, name="Elke's")
        self.pickup_upcoming = PickupDateFactory(store=self.store, date=timezone.now() + relativedelta(hours=1))
        self.pickup_future = PickupDateFactory(store=self.store, date=timezone.now() + relativedelta(hours=12))
        self.pickup_past = PickupDateFactory(store=self.store, date=timezone.now() - relativedelta(days=1))

    def refresh(self):
        for p in (
                self.pickup_upcoming,
                self.pickup_future,
                self.pickup_past
        ):
            p.refresh_from_db()

    @responses.activate
    def test_send_upcoming_notification(self):
        responses.add(responses.POST, 'https://hooks.slack.com/services/some_webhook', body='ok')
        self.group.send_notifications()
        self.refresh()
        self.assertEqual(len(responses.calls), 1)
        self.assertEqual(
            self.pickup_upcoming.notifications_sent.get('upcoming'),
            {'status': 200, 'data': 'ok'},
        )
        slack_request = parse(responses.calls[0].request.body)
        self.assertIn('Food pick-up in', slack_request['attachments'][0]['text'])
        self.assertIn("Elke's", slack_request['attachments'][0]['title'])

        # should not send a second notification
        self.group.send_notifications()
        self.assertEqual(len(responses.calls), 1)
