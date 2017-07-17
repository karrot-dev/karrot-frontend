from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import UserFactory

base_url = '/api/invitations/'


class TestInvitationAPI(APITestCase):
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
        self.assertNotIn('token', response.data)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('?invite=', mail.outbox[0].body)
        token = mail.outbox[0].body.split('?invite=')[1].split('\n')[0]

        self.client.force_login(self.non_member)
        response = self.client.post(base_url + token + '/accept/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(self.non_member, self.group.members.all())
