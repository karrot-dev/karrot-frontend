from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'foodsaving.users'

    def ready(self):
        from . import receivers  # noqa: F401
