from rest_framework import status
from rest_framework.test import APITestCase
from foodsaving.users.factories import UserFactory


class TestSwaggerAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = '/docs/'

    def test_swagger_coreapi(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.accepted_media_type, 'application/coreapi+json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_swagger_html(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url, HTTP_ACCEPT='text/html')
        self.assertEqual(response.accepted_media_type, 'text/html')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
