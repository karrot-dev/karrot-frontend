from django.apps import AppConfig


class GroupsConfig(AppConfig):
    name = 'foodsaving.groups'

    def ready(self):
        from . import signals  # noqa: F401
