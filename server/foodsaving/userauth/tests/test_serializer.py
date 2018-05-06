from django.test import TestCase

from foodsaving.userauth.serializers import AuthUserSerializer
from foodsaving.users.factories import UserFactory


class TestUserSerializer(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_instantiation(self):
        serializer = AuthUserSerializer(self.user)
        for k in ['id', 'display_name', 'email']:
            self.assertEqual(serializer.data[k], getattr(self.user, k))

    def test_fails_if_user_language_is_not_updated(self):
        serializer = AuthUserSerializer(self.user)
        current_language = serializer.data['language']
        serializer.update(self.user, validated_data={'language': 'fr'})
        updated_language = getattr(self.user, 'language')
        self.assertNotEqual(current_language, updated_language)
