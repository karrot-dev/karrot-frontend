from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.subscriptions.models import PushSubscription, PushSubscriptionPlatform
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


class TestSubscriptionsAPI(APITestCase):
    def test_create_push_subscription(self):
        user = UserFactory()
        self.client.force_login(user=user)

        data = {'token': faker.uuid4(), 'platform': 'android'}
        response = self.client.post('/api/subscriptions/push/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['token'], data['token'])
        self.assertEqual(response.data['platform'], data['platform'])

    def test_cannot_create_duplicate_tokens(self):
        user = UserFactory()
        self.client.force_login(user=user)

        data = {'token': faker.uuid4(), 'platform': 'android'}
        response = self.client.post('/api/subscriptions/push/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post('/api/subscriptions/push/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_can_list_subscriptions(self):
        user = UserFactory()
        self.client.force_login(user=user)

        data = {'token': faker.uuid4(), 'platform': 'android'}
        response = self.client.post('/api/subscriptions/push/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get('/api/subscriptions/push/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['token'], data['token'])
        self.assertFalse(hasattr(response.data[0], 'user'))

    def test_retrieve_subscriptions(self):
        user = UserFactory()
        token = faker.uuid4()
        subscription = PushSubscription.objects.create(user=user, token=token,
                                                       platform=PushSubscriptionPlatform.ANDROID)
        self.client.force_login(user=user)
        response = self.client.get('/api/subscriptions/push/{}/'.format(subscription.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], subscription.id)
        self.assertEqual(response.data['token'], subscription.token)
        self.assertFalse(hasattr(response.data, 'user'))

    def test_can_delete_subscriptions(self):
        user = UserFactory()
        token = faker.uuid4()
        subscription = PushSubscription.objects.create(user=user, token=token,
                                                       platform=PushSubscriptionPlatform.ANDROID)
        self.client.force_login(user=user)
        response = self.client.delete('/api/subscriptions/push/{}/'.format(subscription.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PushSubscription.objects.filter(pk=subscription.id).count(), 0)
