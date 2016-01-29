from django.test import TestCase
from yunity.base.other_models import Group
from yunity.permissions.resolver import resolve_permissions
from yunity.users.models import ProfileVisibility
from yunity.utils.tests.mock import MockUser
from yunity.walls.models import Wall


class PermissionsTests(TestCase):
    def setUp(self):
        w = Wall.objects.create()
        w2 = Wall.objects.create()
        g = Group.objects.create(name='toplevel group 1')
        ga = Group.objects.create(name='1a', parent=g)
        gb = Group.objects.create(name='1b', parent=g)
        gc = Group.objects.create(name='1c', parent=g)
        gaa = Group.objects.create(name='1aa', parent=ga)
        h = Group.objects.create(name='toplevel group 2')
        ha = Group.objects.create(name='2a', parent=h)
        hb = Group.objects.create(name='2b', parent=h)
        hba = Group.objects.create(name='2ba', parent=hb)

        t = gaa.hub
        t.wall = w
        t.save()

        t = hb.hub
        t.wall = w2
        t.save()

    def test_nothing(self):
        pass

    def test_user_wall_is_public_readable(self):
        u = MockUser.create(profile_visibility=ProfileVisibility.PUBLIC)
        c = resolve_permissions(u.wall)
        self.assertEqual(c.public, 'read', 'user wall not public readable')

    def test_user_wall_is_community_readable_base(self):
        u = MockUser.create(profile_visibility=ProfileVisibility.COMMUNITIES)
        g = Group.objects.filter(name='toplevel group 2').first()
        g.hub.hubmembership_set.create(user=u)
        c = resolve_permissions(u.wall)
        self.assertEqual(c.group_trees, [(g, 'read')], 'set of communities differs from communities user is part of')

    def test_user_wall_is_community_readable_user_child(self):
        u = MockUser.create(profile_visibility=ProfileVisibility.COMMUNITIES)
        g = Group.objects.filter(name='2ba').first()
        g.hub.hubmembership_set.create(user=u)
        c = resolve_permissions(u.wall)
        community = Group.objects.filter(name='toplevel group 2').first()
        self.assertEqual(c.group_trees, [(community, 'read')],
                         'set of communities differs from communities user is part of')
