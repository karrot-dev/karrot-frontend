from yunity.base.hub_models import Hub
from yunity.base.other_models import Group
from yunity.permissions.collector import Collector
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
            collector.require_hub(h, 'read')
            if g.is_content_included_in_parent:
                for parent in g.parents():
                    collector.require_hub(parent.hub, 'read')
        return

    u = User.objects.filter(wall_id = wall.id).first()
    """:type : User"""
    if u:
        if u.profile_visibility == ProfileVisibility.PUBLIC:
            collector.make_public('read')
        elif u.profile_visibility == ProfileVisibility.PRIVATE:
            pass
        elif u.profile_visibility == ProfileVisibility.REGISTERED_USERS:
            collector.require_user('read')
        elif u.profile_visibility == ProfileVisibility.CONNECTED_USERS:
            collector.require_connection_with(u, 'read')
        elif u.profile_visibility == ProfileVisibility.COMMUNITIES:
            groups = u.hub_set.targets_with_content_type(Group)
            roots = set(map(lambda x: x.root(), groups))
            for r in roots:
                collector.require_group_tree(r, 'read')
        else:
            raise NotImplementedError('Unimplemented ProfileVisibility ' + u.profile_visibility + 'for user ' + u)

resolvers = {Wall: resolve_wall}

def resolve_permissions(instance):
    c = Collector()
    if instance.__class__ in resolvers:
        resolvers[instance.__class__](instance, c)

    return c

