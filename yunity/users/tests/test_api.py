from rest_framework import status
from rest_framework.test import APITestCase
from yunity.utils.tests.fake import faker


class TestUsersAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/users/'
        cls.user_data = {'display_name': faker.name(),
                         'first_name': faker.name(),
                         'last_name': faker.name(),
                         'email': faker.email(),
                         'password': faker.name(),
                         'address': faker.address(),
                         'latitude': faker.latitude(),
                         'longitude': faker.longitude()}

    def test_create(self):
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertAlmostEqual(response.data['latitude'], float(self.user_data['latitude']))
