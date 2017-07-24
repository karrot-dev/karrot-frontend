from django.apps import AppConfig


class GroupsConfig(AppConfig):
    name = 'foodsaving.groups'

    def ready(self):
        from . import receivers  # noqa: F401
