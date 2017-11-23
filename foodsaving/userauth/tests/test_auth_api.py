from django.contrib import auth
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from foodsaving.users.factories import UserFactory


class TestUserAuthAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory(email='user98@example.com')
        self.disabled_user = UserFactory(is_active=False)
        self.url = '/api/auth/'

    def test_login(self):
        data = {'email': self.user.email, 'password': self.user.display_name}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user.email)
        user = auth.get_user(self.client)
        self.assertTrue(user.is_authenticated())

    def test_login_with_similar_email_succeeds(self):
        data = {'email': 'User98@example.com', 'password': self.user.display_name}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user.email)
        user = auth.get_user(self.client)
        self.assertTrue(user.is_authenticated())

    def test_no_credentials(self):
        data = {}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'email': ['This field is required.'],
                                         'password': ['This field is required.']})

    def test_wrong_password(self):
        data = {'email': self.user.email, 'password': 'wrong_password'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['non_field_errors'], ['Unable to login with provided credentials.', ])

    def test_wrong_email(self):
        data = {'email': 'nonexisting@email.com', 'password': 'wrong_password'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['non_field_errors'], ['Unable to login with provided credentials.', ])

    def test_login_as_disabled_user_fails(self):
        data = {'email': self.disabled_user.email, 'password': self.disabled_user.display_name}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.data['non_field_errors'], ['Unable to login with provided credentials.', ])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated())

    def test_status_not_logged_in(self):
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['error_code'], 'not_authenticated', response.data)

    def test_status_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['display_name'], self.user.display_name)

    def test_logout(self):
        self.client.login(email=self.user.email, password=self.user.display_name)
        user = auth.get_user(self.client)
        self.assertTrue(user.is_authenticated())
        response = self.client.post('/api/auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = auth.get_user(self.client)
        self.assertFalse(user.is_authenticated())


class TestTokenAuthAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory(email='user98@example.com')
        self.url = '/api/auth/token/'

    def test_get_token(self):
        response = self.client.post(self.url, {'username': self.user.email, 'password': self.user.display_name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = Token.objects.filter(user=self.user).first()
        self.assertEqual(response.data, {'token': token.key})

    def test_use_token(self):
        token = Token.objects.create(user=self.user)
        response = self.client.get(
            '/api/auth/user/',
            **{'HTTP_AUTHORIZATION': 'Token {}'.format(token.key)}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['email'], self.user.email)
