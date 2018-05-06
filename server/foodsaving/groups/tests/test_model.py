from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.conversations.models import Conversation, ConversationParticipant
from foodsaving.groups import roles
from foodsaving.groups.factories import GroupFactory, PlaygroundGroupFactory
from foodsaving.groups.models import Group, GroupMembership, get_default_notification_types
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
        membership = GroupMembership.objects.get(user=user, group=group)
        self.assertIn(roles.GROUP_MEMBERSHIP_MANAGER, membership.roles)

    def test_notifications_on_by_default(self):
        user = UserFactory()
        group = GroupFactory(members=[user])
        membership = GroupMembership.objects.get(user=user, group=group)
        self.assertEqual(get_default_notification_types(), membership.notification_types)
        conversation = Conversation.objects.get_for_target(group)
        conversation_participant = ConversationParticipant.objects.get(conversation=conversation, user=user)
        self.assertTrue(conversation_participant.email_notifications)

    def test_no_notifications_by_default_in_playground(self):
        user = UserFactory()
        group = PlaygroundGroupFactory(members=[user])
        membership = GroupMembership.objects.get(user=user, group=group)
        self.assertEqual([], membership.notification_types)
        conversation = Conversation.objects.get_for_target(group)
        conversation_participant = ConversationParticipant.objects.get(conversation=conversation, user=user)
        self.assertFalse(conversation_participant.email_notifications)
