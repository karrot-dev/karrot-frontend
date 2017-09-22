from rest_framework import status
from rest_framework.test import APITestCase
from dateutil.relativedelta import relativedelta
from django.utils import timezone

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory, PickupDateFactory
from foodsaving.users.factories import UserFactory
from foodsaving.stores.models import Feedback


class TestFeedbackAPIFilter(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/feedback/'

        # create a group with a user and two stores
        cls.collector = UserFactory()
        cls.collector2 = UserFactory()
        cls.group = GroupFactory(members=[cls.collector, cls.collector2, ])
        cls.store = StoreFactory(group=cls.group)
        cls.store2 = StoreFactory(group=cls.group)
        cls.pickup = PickupDateFactory(store=cls.store, date=timezone.now() - relativedelta(days=1))
        cls.pickup2 = PickupDateFactory(store=cls.store2, date=timezone.now() - relativedelta(days=1))

        # create a feedback data
        cls.feedback_get = {
            'given_by': cls.collector,
            'about': cls.pickup,
            'weight': 1,
            'comment': 'asfjk'
        }
        cls.feedback_get2 = {
            'given_by': cls.collector2,
            'about': cls.pickup2,
            'weight': 2,
            'comment': 'bsfjk'
        }

        # create 2 instances of feedback
        cls.feedback = Feedback.objects.create(**cls.feedback_get)
        cls.feedback2 = Feedback.objects.create(**cls.feedback_get2)

        # transforms the user into a collector
        cls.pickup.collectors.add(cls.collector, )
        cls.pickup2.collectors.add(cls.collector, cls.collector2)

    def test_filter_by_about(self):
        """
        Filter the two feedbacks and return the one that is about 'pickup'
        """
        self.client.force_login(user=self.collector)
        response = self.client.get(self.url, {'about': self.pickup.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['about'], self.pickup.id)
        self.assertEqual(len(response.data), 1)

    def test_filter_by_given_by(self):
        """
        Filter the two feedbacks and return the one that is given_by 'collector'
        """
        self.client.force_login(user=self.collector)
        response = self.client.get(self.url, {'given_by': self.collector.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['given_by'], self.collector.id)
        self.assertEqual(len(response.data), 1)

    def test_filter_by_store(self):
        """
        Filter the two feedbacks and return the one that is about the pickup at 'store'
        """
        self.client.force_login(user=self.collector)
        response = self.client.get(self.url, {'store': self.store.id})
        self.assertEqual(response.data[0]['id'], self.feedback.id)
        self.assertEqual(response.data[0]['about'], self.pickup.id)
        self.assertEqual(len(response.data), 1)

    def test_filter_by_store_2(self):
        """
        Filter the two feedbacks and return the one that is about the pickup at 'store2'
        """
        self.client.force_login(user=self.collector)
        response = self.client.get(self.url, {'store': self.store2.id})
        self.assertEqual(response.data[0]['id'], self.feedback2.id)
        self.assertEqual(response.data[0]['about'], self.pickup2.id)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
