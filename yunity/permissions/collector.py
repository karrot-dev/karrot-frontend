class Collector():
    def __init__(self):
        self.hubs = []

    def add_hub(self, hub, action):
        self.hubs.append((hub, action))

    def make_public(self):
        self.public = True

    def requires_user(self):
        self.requires_user = True

    def connected_with(self, user):
        self.connected_with = user

