from django.apps import AppConfig


class SubscriptionsConfig(AppConfig):
    name = 'foodsaving.subscriptions'

    def ready(self):
        from . import consumers, receivers # noqa: F401
