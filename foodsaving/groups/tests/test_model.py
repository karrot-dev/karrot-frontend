from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.groups.models import Group


class TestGroupModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            Group.objects.create(name='a' * 81)

    def test_create_group_with_same_name_fails(self):
        Group.objects.create(name='abcdef')
        with self.assertRaises(IntegrityError):
            Group.objects.create(name='abcdef')
