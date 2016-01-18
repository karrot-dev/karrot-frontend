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
            collector.add_hub(h, 'read')
            if g.is_content_included_in_parent:
                for parent in g.parents():
                    collector.add_hub(parent.hub, 'read')
        return

    u = User.objects.filter(wall_id = wall.id).first()
    """:type : User"""
    if u:
        if u.profile_visibility == ProfileVisibility.PUBLIC:
            collector.make_public()
        elif u.profile_visibility == ProfileVisibility.PRIVATE:
            pass
        elif u.profile_visibility == ProfileVisibility.REGISTERED_USERS:
            collector.requires_user()
        elif u.profile_visibility == ProfileVisibility.CONNECTED_USERS:
            collector.connected_with(u)
        elif u.profile_visibility == ProfileVisibility.COMMUNITIES:
            groups = u.hub_set.targets_with_content_type(Group)
            roots = map(lambda x: x.root(), groups)
            hubs = map(lambda g: g.hub, Group.all_children_of(roots))
            for h in hubs:
                collector.add_hub(h, 'read')
        else:
            raise NotImplementedError('Unimplemented ProfileVisibility ' + u.profile_visibility + 'for user ' + u)

resolvers = {Wall: resolve_wall}

def resolve(instance):
    c = Collector()
    if instance.__class__ in resolvers:
        resolvers[instance.__class__](instance, c)

    return c

