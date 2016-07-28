from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group
from yunity.utils.tests.fake import faker


class TestStoresAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/stores/'
        cls.group = Group()
        cls.user_data = {'name': faker.name(),
                         'description': faker.name(),
                         'group': cls.group.id,
                         'address': faker.address(),
                         'latitude': faker.latitude(),
                         'longitude': faker.longitude()}

    def test_create(self):
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], self.user_data['name'])
