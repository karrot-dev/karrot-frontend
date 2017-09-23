from django.test import TestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.history.models import History
from foodsaving.invitations.models import Invitation
from foodsaving.users.factories import UserFactory


class TestInvitationsModel(TestCase):
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


class TestAcceptInvite(TestCase):
    def test_invite_accepted_joins_group_and_adds_history(self):
        g = GroupFactory()
        u = UserFactory()
        i = Invitation.objects.create(
            email='bla@bla.com',
            group=g,
            invited_by=u
        )
        invited_user = UserFactory()

        i.accept(invited_user)

        invited_user.refresh_from_db()
        self.assertEqual(invited_user.current_group, g)

        h = History.objects.all()
        self.assertEqual(h.count(), 1)
        h = h.first()
        self.assertEqual(h.payload['invited_by'], u.id)
        self.assertEqual(h.payload['invited_at'], i.created_at.isoformat())
        self.assertEqual(h.payload['invited_via'], 'e-mail')

        self.assertEqual(Invitation.objects.count(), 0)

