import re

from dateutil.relativedelta import relativedelta
from django.core import mail
from django.utils import timezone
from furl import furl
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.history.models import History
from foodsaving.invitations.models import Invitation
from foodsaving.users.factories import UserFactory

base_url = '/api/invitations/'


class TestInvitationAPIIntegration(APITestCase):
    def setUp(self):
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.non_member = UserFactory()

        # effectively disable throttling
        from foodsaving.invitations.api import InvitesPerDayThrottle
        InvitesPerDayThrottle.rate = '1000/day'

        mail.outbox = []

    def test_invite_flow(self):
        self.assertIn(self.member, self.group.members.all())
        self.assertNotIn(self.non_member, self.group.members.all())
        self.client.force_login(self.member)

        # invite somebody via email
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.data['email'], 'please@join.com')
        self.assertEqual(response.data['group'], self.group.id)
        self.assertEqual(response.data['invited_by'], self.member.id)
        self.assertNotIn('token', response.data)

        # check if email has been sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('invite=', mail.outbox[0].body)
        token = furl(
            re.search(r'(/#/signup.*)\n', mail.outbox[0].body).group(1)
        ).fragment.args['invite']

        # accept the invite
        self.client.force_login(self.non_member)
        response = self.client.post(base_url + token + '/accept/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.non_member, self.group.members.all())

        # check if current_group is set to invited group
        response = self.client.get('/api/auth/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['current_group'], self.group.id)


class TestInviteCreate(APITestCase):
    def setUp(self):
        self.member = UserFactory()
        self.member2 = UserFactory()
        self.group = GroupFactory(members=[self.member, self.member2])
        self.group2 = GroupFactory(members=[self.member, ])

        # effectively disable throttling
        from foodsaving.invitations.api import InvitesPerDayThrottle
        InvitesPerDayThrottle.rate = '1000/day'

    def test_invite_same_email_twice(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invite_same_email_twice_when_expired(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # make invitation expire
        i = Invitation.objects.get(id=response.data['id'])
        i.expires_at = timezone.now() - relativedelta(days=1)
        i.save()

        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_invite_same_email_to_different_groups(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group2.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invite_existing_user_but_not_member(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': self.member2.email, 'group': self.group2.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invite_existing_member(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': self.member2.email, 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invite_to_invalid_group(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': 345236})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invite_with_invalid_email(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'pleasehä', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invite_when_inviting_user_is_not_member_of_group(self):
        self.client.force_login(self.member2)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group2.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestInvitationAPI(APITestCase):
    def setUp(self):
        self.member = UserFactory()
        self.member2 = UserFactory()
        self.group = GroupFactory(members=[self.member, self.member2])
        self.non_member = UserFactory()

    def test_list_invitations(self):
        self.client.force_login(self.member)
        self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})

        # not logged in
        self.client.logout()
        response = self.client.get(base_url)
        self.assertTrue(status.is_client_error(response.status_code))

        # user not in group
        self.client.force_login(self.non_member)
        response = self.client.get(base_url)
        self.assertEqual(len(response.data), 0)

        # user in group
        self.client.force_login(self.member)
        response = self.client.get(base_url)
        self.assertEqual(len(response.data), 1)

        # another user in group
        self.client.force_login(self.member2)
        response = self.client.get(base_url)
        self.assertEqual(len(response.data), 1)


class TestInvitationAcceptAPI(APITestCase):
    def setUp(self):
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.non_member = UserFactory()

        # effectively disable throttling
        from foodsaving.invitations.api import InvitesPerDayThrottle
        InvitesPerDayThrottle.rate = '1000/day'

        mail.outbox = []

    def test_accept_invite_with_expired_invitation(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})

        # make invitation expire
        i = Invitation.objects.get(id=response.data['id'])
        i.expires_at = timezone.now() - relativedelta(days=1)
        i.save()

        token = furl(
            re.search(r'(/#/signup.*)\n', mail.outbox[0].body).group(1)
        ).fragment.args['invite']

        # accept the invite
        self.client.force_login(self.non_member)
        response = self.client.post(base_url + token + '/accept/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(self.group.members.count(), 1)

    def test_accept_invite_when_already_in_group(self):
        self.client.force_login(self.member)
        self.client.post(base_url, {'email': 'someother@mail.com', 'group': self.group.id})

        token = furl(
            re.search(r'(/#/signup.*)\n', mail.outbox[0].body).group(1)
        ).fragment.args['invite']

        # accidentally accept the invite even though you are already in the group
        response = self.client.post(base_url + token + '/accept/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.group.members.count(), 1)

        # should not add any history
        self.assertEqual(History.objects.count(), 0)

    def test_accept_invite_when_signed_out(self):
        self.client.force_login(self.member)
        self.client.post(base_url, {'email': 'someother@mail.com', 'group': self.group.id})

        token = furl(
            re.search(r'(/#/signup.*)\n', mail.outbox[0].body).group(1)
        ).fragment.args['invite']

        self.client.logout()
        response = self.client.post(base_url + token + '/accept/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
