import json

import responses
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory, PickupDateFactory
from foodsaving.users.factories import UserFactory


class TestNotifications(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.store = StoreFactory(group=cls.group)
        cls.pickup = PickupDateFactory(store=cls.store)

    @responses.activate
    def test_send_no_upcoming_notification_if_no_webhook(self):
        self.pickup.notify_upcoming()

    @responses.activate
    def test_send_upcoming_notification(self):
        responses.add(responses.POST, 'https://example.com/test', body='ok')
        self.pickup.date = timezone.now() + relativedelta(hours=1)
        self.pickup.save()
        self.group.slack_webhook = 'https://example.com/test'
        self.group.save()
        self.pickup.notify_upcoming()
        self.assertEqual(len(responses.calls), 1)
        self.assertEqual(self.pickup.notifications_sent['upcoming'], {'status': 200, 'data': 'ok'})
        self.assertTrue('Food pickup at' in json.loads(responses.calls[0].request.body.decode('utf8'))['text'])

        # should not send a second notification
        self.pickup.notify_upcoming()
        self.assertEqual(len(responses.calls), 1)


