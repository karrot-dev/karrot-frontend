from django.apps import AppConfig


class BaseConfig(AppConfig):
    name = 'foodsaving.base'

    def ready(self):
        from . import checks  # noqa: F401
