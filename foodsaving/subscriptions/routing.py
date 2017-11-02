from channels.routing import route_class

from .consumers import Consumer

channel_routing = [
    route_class(Consumer)
]
