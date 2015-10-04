from . import factories as f
import json

from django.test import TestCase
from yunity.api.public.users import Users as UsersView
from yunity.models import User as UserModel
from yunity.tests.utils import JSONRequestFactory

import yunity.utils.status as status


class UserTestCase(TestCase):

    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = JSONRequestFactory()
        self.UsersView = UsersView.as_view()

    def test_create_user(self):
        user = f.UserFactory.create()
        userdb = UserModel.objects.get(email=user.email)
        assert(user==userdb)

    def test_create_user_api(self):
        userdata = {'email': 'foodsharing-raphi@gmail.com',
                 'display_name': 'Foodsharing Raphi',
                 'password': 'iamawesome42',
                 'latitude': 42.13452,
                 'longitude': 34.2344}
        request = self.factory.post('/api/user', userdata)
        response = self.UsersView(request)
        assert(response.status_code == status.HTTP_201_CREATED)

        userdb = UserModel.objects.get(email='foodsharing-raphi@gmail.com')
        assert(userdb.locations[0]['latitude'] == userdata['latitude'])
        assert(userdb.locations[0]['longitude'] == userdata['longitude'])



