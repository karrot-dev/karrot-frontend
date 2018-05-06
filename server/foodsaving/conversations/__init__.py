from django.apps import AppConfig


class ConversationsConfig(AppConfig):
    name = 'foodsaving.conversations'

    def ready(self):
        from . import receivers  # noqa: F401
