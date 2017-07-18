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


class TestInviteCreate(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()
        cls.member2 = UserFactory()
        cls.group = GroupFactory(members=[cls.member, cls.member2])
        cls.group2 = GroupFactory(members=[cls.member, ])

    def test_invite_same_mail_twice(self):
        self.client.force_login(self.member)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post(base_url, {'email': 'please@join.com', 'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invite_same_mail_to_different_groups(self):
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
