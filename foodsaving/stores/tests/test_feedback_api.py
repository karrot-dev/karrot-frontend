from dateutil.relativedelta import relativedelta
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory, PickupDateFactory
from foodsaving.stores.models import Feedback
from foodsaving.users.factories import UserFactory


class FeedbackTest(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/feedback/'

        cls.member = UserFactory()
        cls.collector = UserFactory()
        cls.collector2 = UserFactory()
        cls.collector3 = UserFactory()
        cls.evil_collector = UserFactory()
        cls.group = GroupFactory(members=[
            cls.member, cls.collector, cls.evil_collector, cls.collector2, cls.collector3
        ])
        cls.store = StoreFactory(group=cls.group)
        cls.pickup = PickupDateFactory(store=cls.store, date=timezone.now() + relativedelta(days=1))

        # not a member of the group
        cls.user = UserFactory()

        # past pickup date
        cls.past_pickup = PickupDateFactory(store=cls.store, date=timezone.now() - relativedelta(days=1))

        # old pickup date
        cls.old_pickup = PickupDateFactory(store=cls.store, date=timezone.now() - relativedelta(days=32))

        # transforms the member into a collector
        cls.past_pickup.collectors.add(cls.collector, cls.evil_collector, cls.collector2, cls.collector3)
        cls.pickup.collectors.add(cls.collector, cls.collector2, cls.collector3)
        cls.old_pickup.collectors.add(cls.collector3)

        # create feedback for POST method
        cls.feedback_post = {
            'about': cls.past_pickup.id,
            'weight': 2,
            'comment': 'asfjk'
        }

        # create feedback for POST method without weight and comment
        cls.feedback_without_weight_comment = {
            'about': cls.past_pickup.id,
        }

        # create feedback to future pickup
        cls.future_feedback_post = {
            'about': cls.pickup.id,
            'weight': 2,
            'comment': 'asfjk'
        }

        # create feedback for an old pickup
        cls.feedback_for_old_pickup = {
            'about': cls.old_pickup.id,
            'weight': 5,
            'comment': 'this is long ago'
        }

        # create feedback for GET method
        cls.feedback_get = {
            'given_by': cls.collector,
            'about': cls.past_pickup,
            'weight': 2,
            'comment': 'asfjk2'
        }

        cls.feedback_get_2 = {
            'given_by': cls.collector2,
            'about': cls.past_pickup,
            'weight': 2,
            'comment': 'asfjk'
        }

        # create 2 instances of feedback for GET method
        cls.feedback = Feedback.objects.create(**cls.feedback_get)
        Feedback.objects.create(**cls.feedback_get_2)

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
        Group Member is not allowed to give feedback when he is not assigned to the
        Pickup.
        """
        self.client.force_login(user=self.member)
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'about': ['You aren\'t assigned to the pickup.']})

    def test_create_feedback_works_as_collector(self):
        """
        Member is allowed to give feedback when he is assigned to the Pickup.
        """
        self.client.force_login(user=self.collector3)
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_create_feedback_twice_fails_for_one_pickup(self):
        """
        Collector is not allowed to give feedback more than one time to the Pickup.
        """
        self.client.force_login(user=self.collector3)
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        response = self.client.post(self.url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'non_field_errors': ['The fields about, given_by must make a unique set.']})

    def test_create_feedback_fails_for_old_pickup(self):
        """
        Collector is not allowed to give feedback for old Pickups.
        """
        self.client.force_login(user=self.collector3)
        response = self.client.post(self.url, self.feedback_for_old_pickup, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(
            response.data, {'about': ['You can\'t give feedback for pickups more than 30 days ago.']}
        )

    def test_create_feedback_without_weight(self):
        """
        Weight field can be empty
        """
        self.client.force_login(user=self.collector3)
        response = self.client.post(self.url, {k: v for (k, v) in self.feedback_post.items() if k is not 'weight'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertIsNone(response.data['weight'])

    def test_create_feedback_without_comment(self):
        """
        Comment field can be empty
        """
        self.client.force_login(user=self.collector3)
        response = self.client.post(self.url, {k: v for (k, v) in self.feedback_post.items() if k is not 'comment'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['comment'], '')

    def test_weight_and_comment_is_null_fails(self):
        """
        Both comment and weight cannot be empty
        - non-working test at the moment
        """
        self.client.force_login(user=self.collector3)
        response = self.client.post(self.url, self.feedback_without_weight_comment, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'non_field_errors': ['Both comment and weight cannot be blank.']})

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
        self.client.force_login(user=self.collector3)
        response = self.client.post(self.url, self.future_feedback_post)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'about': ['The pickup is not done yet']})

    def test_patch_feedback_fails_as_non_user(self):
        """
        Non-user is not allowed to change feedback
        """
        response = self.client.patch(self.feedback_url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_patch_feedback_fails_as_user(self):
        """
        User is not allowed to change feedback
        """
        self.client.force_login(user=self.user)
        response = self.client.patch(self.feedback_url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_patch_feedback_fails_as_group_member(self):
        """
        Group member is not allowed to change feedback
        """
        self.client.force_login(user=self.member)
        response = self.client.patch(self.feedback_url, self.feedback_post, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_patch_feedback_fails_as_evil_collector(self):
        """
        A collector is not allowed to change feedback if he didn't created it
        """
        self.client.force_login(user=self.evil_collector)
        response = self.client.patch(self.feedback_url, {'weight': 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_patch_feedback_works_as_collector(self):
        """
        Collector is allowed to change feedback
        """
        self.client.force_login(user=self.collector)
        response = self.client.patch(self.feedback_url, {'weight': 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['weight'], 3)

    def test_patch_weight_to_negative_value_fails(self):
        """
        Collector cannot change weight to negative value
        """
        self.client.force_login(user=self.collector)
        response = self.client.patch(self.feedback_url, {'weight': -1}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
