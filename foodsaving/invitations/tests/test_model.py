from django.test import TestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.invitations.models import Invitation
from foodsaving.users.factories import UserFactory


class TestInvitationsModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    def test_dont_escape_url_parameters(self):
        g = GroupFactory()
        u = UserFactory()
        i = Invitation.objects.create(
            email='bla@bla.com',
            group=g,
            invited_by=u
        )
        b = i.get_email_body()
        self.assertNotIn('&amp;', b)
