from rest_framework import status
from rest_framework.test import APITestCase
from dateutil.relativedelta import relativedelta

from django.utils import timezone
from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory, PickupDateFactory
from foodsaving.users.factories import UserFactory
from foodsaving.stores.models import Feedback


class FeedbackTest(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/feedback/'

        cls.member = UserFactory()
        cls.collector = UserFactory()
        cls.group = GroupFactory(members=[cls.member, cls.collector])
        cls.store = StoreFactory(group=cls.group)
        cls.pickup = PickupDateFactory(store=cls.store, date=timezone.now() + relativedelta(days=1))

        # not a member of the group
        cls.user = UserFactory()

        # past pickup date
        cls.past_pickup = PickupDateFactory(store=cls.store, date=timezone.now() - relativedelta(days=1))

        # transforms the member into a collector
        cls.past_pickup.collectors.add(cls.collector)

        # create a feedback data for POST method
        cls.feedback_post = {
            'about': cls.past_pickup.id,
            'weight': 2,
            'comment': 'asfjk'
        }

        # create a feedback to future pickup
        cls.future_feedback_post = {
            'about': cls.pickup.id,
            'weight': 2,
            'comment': 'asfjk'
        }

        # create a feedback data for GET method
        cls.feedback_get = {
            'given_by': cls.collector,
            'about': cls.past_pickup,
            'weight': 2,
            'comment': 'asfjk'
        }

        # create 2 instances of feedback for GET method
        cls.feedback = Feedback.objects.create(**cls.feedback_get)
        Feedback.objects.create(**cls.feedback_get)

        cls.feedback_url = cls.url + str(cls.feedback.id) + '/'

    def test_create_feedback_fails_as_non_user(self):
        """
        Non-User is not allowed to give feedback.
        """
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_create_feedback_fails_as_non_group_member(self):
        """
        User is not allowed to give feedback when not a member of the stores group.
        """
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'about': ['You are not member of the store\'s group.']})

    def test_create_feedback_fails_as_non_collector(self):
        """
        Group Member is not allowed to give feedback when he is not assiged to the
        Pickup.
        """
        self.client.force_login(user=self.member)
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'about': ['You aren\'t assigned to the pickup.']})

    def test_create_feedback_works_as_collector(self):
        """
        Member is allowed to give feedback when he is assiged to the Pickup.
        """
        self.client.force_login(user=self.collector)
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_list_feedback_fails_as_non_user(self):
        """
        Non-User is NOT allowed to see list of feedback
        """
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_list_feedback_works_as_non_group_member(self):
        """
        Non-Member doesn't see feedback but an empty list
        """
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 0)

    def test_list_feedback_works_as_group_member(self):
        """
        Member is allowed to see list of feedback (DOUBLE CHECK!!)
        """
        self.client.force_login(user=self.member)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 2)

    def test_list_feedback_works_as_collector(self):
        """
        Collector is allowed to see list of feedback
        """
        self.client.force_login(user=self.collector)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_feedback_fails_as_non_user(self):
        """
        Non-User is NOT allowed to see single feedback
        """
        response = self.client.get(self.feedback_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_retrieve_feedback_fails_as_non_group_member(self):
        """
        Non-Member is NOT allowed to see single feedback
        """
        self.client.force_login(user=self.user)
        response = self.client.get(self.feedback_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_retrieve_feedback_works_as_group_member(self):
        """
        Member is allowed to see single feedback
        """
        self.client.force_login(user=self.member)
        response = self.client.get(self.feedback_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

    def test_retrieve_feedback_works_as_collector(self):
        """
        Collector is allowed to see list of feedback
        """
        self.client.force_login(user=self.collector)
        response = self.client.get(self.feedback_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

    def test_create_future_feedback_fails_as_collector(self):
        """
        Collector is NOT allowed to leave feedback for future pickup
        """
        self.client.force_login(user=self.collector)
        response = self.client.post(self.url, self.future_feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
