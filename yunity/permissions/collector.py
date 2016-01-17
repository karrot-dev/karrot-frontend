class Collector():
    def __init__(self):
        self.hubs = []

    def add_hub(self, hub, action):
        self.hubs.append((hub, action))

