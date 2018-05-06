from django.apps import AppConfig


class PickupsConfig(AppConfig):
    name = 'foodsaving.pickups'

    def ready(self):
        from . import receivers  # noqa: F401
