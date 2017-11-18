from django.test import TestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.serializers import GroupDetailSerializer, GroupPreviewSerializer
from foodsaving.users.factories import UserFactory


class TestGroupSerializer(TestCase):
    def setUp(self):
        self.group = GroupFactory(members=[UserFactory() for _ in range(3)])

    def test_detail(self):
        serializer = GroupDetailSerializer(self.group)
        self.assertEqual(len(serializer.data.keys()), 13)
        self.assertEqual(serializer.data['id'], self.group.id)
        self.assertEqual(serializer.data['name'], self.group.name)
        self.assertEqual(serializer.data['description'], self.group.description)
        self.assertEqual(sorted(serializer.data['members']),
                         sorted([_.id for _ in self.group.members.all()]))
        self.assertEqual(sorted(list(serializer.data['memberships'].keys())),
                         sorted([_.id for _ in self.group.members.all()]))

    def test_preview(self):
        serializer = GroupPreviewSerializer(self.group)
        self.assertEqual(len(serializer.data.keys()), 8)
        self.assertEqual(serializer.data['id'], self.group.id)
        self.assertEqual(serializer.data['name'], self.group.name)
