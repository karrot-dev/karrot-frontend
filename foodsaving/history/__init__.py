from django.apps import AppConfig


class HistoryConfig(AppConfig):
    name = 'foodsaving.history'

    def ready(self):
        from . import receivers  # noqa: F401
