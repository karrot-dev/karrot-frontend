from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.groups import roles
from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.models import Group, GroupMembership
from foodsaving.users.factories import UserFactory


class TestGroupModel(TestCase):
    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            Group.objects.create(name='a' * 81)

    def test_create_group_with_same_name_fails(self):
        Group.objects.create(name='abcdef')
        with self.assertRaises(IntegrityError):
            Group.objects.create(name='abcdef')

    def test_roles_initialized(self):
        user = UserFactory()
        group = GroupFactory(members=[user])
        membership = GroupMembership.objects.filter(user=user, group=group).first()
        self.assertIn(roles.GROUP_MEMBERSHIP_MANAGER, membership.roles)
