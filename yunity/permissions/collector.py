from django.contrib.contenttypes.models import ContentType
from yunity.permissions.models import HubPermission, UserPermission, GroupTreePermission, UserConnectionPermission


class Collector():
    """ Collects permissions for some object. They are OR-combined.
    """
    def __init__(self):
        self.hubs = []
        self.users = []
        self.group_trees = []
        self.connected_with = []
        self.public = None
        self.requires_user = None

    def allow_hub(self, hub, action):
        self.hubs.append((hub, action))

    def allow_group_tree(self, group, action):
        self.group_trees.append((group, action))

    def allow_connection_with(self, user, action):
        self.connected_with.append((user, action))

    def allow_user(self, user, action):
        self.users.append((user, action))

    def allow_public(self, action):
        self.public = action

    def allow_any_registered_user(self, action):
        self.requires_user = action

    def save(self, target):
        """ Creates the model entries for this collector to store the permissions.
        """
        base_params = {'target_content_type_id': ContentType.objects.get_for_model(target).id, 'target_id': target.id}

        for h, a in self.hubs:
            HubPermission.objects.get_or_create(hub=h, action=a, **base_params)

        for u, a in self.users:
            UserPermission.objects.get_or_create(user=u, action=a, **base_params)

        for g, a in self.group_trees:
            GroupTreePermission.objects.get_or_create(group=g, action=a, **base_params)

        for u, a in self.connected_with:
            UserConnectionPermission.objects.get_or_create(user=u, action=a, **base_params)
