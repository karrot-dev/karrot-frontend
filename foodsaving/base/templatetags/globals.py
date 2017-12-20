from django.conf import settings
from django_jinja import library


@library.global_function
def site_name():
    """
    Usage: {{ site_name() }}
    """
    return settings.SITE_NAME
