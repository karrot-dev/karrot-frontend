from rest_framework import status
from rest_framework.test import APITestCase
from yunity.users.factories import User


class TestSwaggerAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User()
        cls.url = '/docs/'

    def test_swagger(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
