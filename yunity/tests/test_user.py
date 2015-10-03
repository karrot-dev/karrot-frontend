from . import factories as f

from django.test import TestCase, RequestFactory
from urllib3 import HTTPResponse
from yunity.api.public.users import Users
from yunity.models import User

import yunity.utils.status as status


class UserTestCase(TestCase):

    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        self.UsersView = Users.as_view()

    def test_create_user(self):
        user = f.UserFactory.create()
        userdb = User.objects.get(email=user.email)
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

        userdb = User.objects.get(email='foodsharing-raphi@gmail.com')
        assert(userdb.locations[0]['latitude'] == userdata['latitude'])
        assert(userdb.locations[0]['longitude'] == userdata['longitude'])



