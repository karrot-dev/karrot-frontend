from django.test import TestCase
from yunity.groups.factories import Group
from yunity.groups.serializers import GroupSerializer
from yunity.users.factories import UserFactory


class TestGroupSerializer(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.group = Group(members=[UserFactory() for _ in range(3)])

    def test_instantiation(self):
        serializer = GroupSerializer(self.group)
        self.assertEqual(serializer.data['id'], self.group.id)
        self.assertEqual(serializer.data['name'], self.group.name)
        self.assertEqual(serializer.data['description'], self.group.description)
        self.assertEqual(serializer.data['members'],
                         [_.id for _ in self.group.members.all()])
