from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import UserFactory

base_url = '/api/invitations/'


class TestInvitationAPIIntegration(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.non_member = UserFactory()

    def test_invite_flow(self):
        self.assertIn(self.member, self.group.members.all())
        self.assertNotIn(self.non_member, self.group.members.all())
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.data['email'], 'please@join.com')
        self.assertEqual(response.data['group'], self.group.id)
        self.assertEqual(response.data['invited_by'], self.member.id)
        self.assertNotIn('token', response.data)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('?invite=', mail.outbox[0].body)
        token = mail.outbox[0].body.split('?invite=')[1].split('\n')[0]

        self.client.force_login(self.non_member)
        response = self.client.post(base_url + token + '/accept/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.non_member, self.group.members.all())


class TestInvitationAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()
        cls.member2 = UserFactory()
        cls.group = GroupFactory(members=[cls.member, cls.member2])
        cls.non_member = UserFactory()

    def test_list_invitations(self):
        self.client.force_login(self.member)
        self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})

        # not logged in
        self.client.logout()
        response = self.client.get(base_url)
        self.assertEqual(len(response.data), 0)

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
