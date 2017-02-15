from django.apps import AppConfig


class StoresConfig(AppConfig):
    name = 'foodsaving.stores'

    def ready(self):
        from . import signals  # noqa: F401
