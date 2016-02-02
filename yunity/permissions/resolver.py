from django.contrib.contenttypes.models import ContentType
from django.db.models.signals import post_save
from django.dispatch import receiver

from yunity.base.hub_models import Hub
from yunity.base.other_models import Group
from yunity.permissions.models import HubPermission, UserPermission, GroupTreePermission, UserConnectionPermission, \
    ConstantPermission, ConstantPermissionType
from yunity.users.models import User, ProfileVisibility
from yunity.walls.models import Wall


def resolve_wall(wall, collector):
    """
    a wall of a group is accessible for everyone in the group.
    Additionally, a group setting may make group content (also walls) available in all parents as well.
    """
    h = Hub.objects.filter(wall_id = wall.id).first()
    if h:
        if h.target_content_type.model == 'group':
            g = h.target
            """:type : Group"""
            collector.allow_hub(h, 'read')
            if g.is_content_included_in_parent:
                for parent in g.parents():
                    collector.allow_hub(parent.hub, 'read')
            for team in h.team_set.all():
                for action in team.actions.filter(module='wall'):
                    collector.allow_hub(team.hub, action.action)
        return

    u = User.objects.filter(wall_id = wall.id).first()
    """:type : User"""
    if u:
        collector.allow_user(u, 'read')
        if u.profile_visibility == ProfileVisibility.PUBLIC:
            collector.allow_public('read')
        elif u.profile_visibility == ProfileVisibility.PRIVATE:
            pass
        elif u.profile_visibility == ProfileVisibility.REGISTERED_USERS:
            collector.allow_any_registered_user('read')
        elif u.profile_visibility == ProfileVisibility.CONNECTED_USERS:
            collector.allow_connection_with(u, 'read')
        elif u.profile_visibility == ProfileVisibility.COMMUNITIES:
            groups = u.hub_set.targets_with_content_type(Group)
            roots = set(map(lambda x: x.root(), groups))
            for r in roots:
                collector.allow_group_tree(r, 'read')
        else:
            raise NotImplementedError('Unimplemented ProfileVisibility ' + u.profile_visibility + 'for user ' + u)


def resolve_group(group, collector):
    collector.add(resolve_permissions(group.hub.wall))
    for g in group.children.all():
        resolve_group(g, collector)


resolvers = {
    Wall: resolve_wall,
    Group: resolve_group
}


def resolve_permissions(target):
    c = Collector(target)
    if target.__class__ in resolvers:
        resolvers[target.__class__](target, c)

    return c


def save_permissions(target):
    resolve_permissions(target).save()


class Collector():
    """ Collects permissions for some object. They are OR-combined.
    """
    def __init__(self, target):
        self.target = target
        self.hubs = []
        self.users = []
        self.group_trees = []
        self.connected_with = []
        self.public_actions = []
        self.any_registered_user_actions = []
        self.child_collectors = []

    def add(self, collector):
        self.child_collectors.append(collector)

    def allow_hub(self, hub, action):
        self.hubs.append((hub, action))

    def allow_group_tree(self, group, action):
        self.group_trees.append((group, action))

    def allow_connection_with(self, user, action):
        self.connected_with.append((user, action))

    def allow_user(self, user, action):
        self.users.append((user, action))

    def allow_public(self, action):
        self.public_actions.append(action)

    def allow_any_registered_user(self, action):
        self.any_registered_user_actions.append(action)

    def save(self):
        """ Creates the model entries for this collector to store the permissions.
        """

        for c in self.child_collectors:
            c.save()

        base_params = {'target_content_type_id': ContentType.objects.get_for_model(self.target).id, 'target_id': self.target.id}

        for h, a in self.hubs:
            HubPermission.objects.get_or_create(hub=h, action=a, **base_params)

        for u, a in self.users:
            UserPermission.objects.get_or_create(user=u, action=a, **base_params)

        for g, a in self.group_trees:
            GroupTreePermission.objects.get_or_create(group=g, action=a, **base_params)

        for u, a in self.connected_with:
            UserConnectionPermission.objects.get_or_create(user=u, action=a, **base_params)

        for a in self.public_actions:
            ConstantPermission.objects.get_or_create(type=ConstantPermissionType.PUBLIC, action=a, **base_params)

        for a in self.any_registered_user_actions:
            ConstantPermission.objects.get_or_create(type=ConstantPermissionType.REGISTERED_USERS, action=a, **base_params)


# @receiver(post_save)
# def save_permissions_after_save(sender, instance, **kwargs):
#     print('saving', instance)
#     save_permissions(instance)