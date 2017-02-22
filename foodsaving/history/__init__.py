from django.apps import AppConfig


class HistoryConfig(AppConfig):
    name = 'foodsaving.history'

    def ready(self):
        from . import signals  # noqa: F401
