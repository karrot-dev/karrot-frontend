class Collector():
    def __init__(self):
        self.hubs = []
        self.user = []
        self.group_trees = []
        self.connected_with = []
        self.public = None
        self.requires_user = None

    def require_hub(self, hub, action):
        self.hubs.append((hub, action))

    def require_group_tree(self, group, action):
        self.group_trees.append((group, action))

    def make_public(self, action):
        self.public = action

    def require_user(self, action):
        self.requires_user = action

    def require_connection_with(self, user, action):
        self.connected_with.append((user, action))
