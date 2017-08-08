# Start with the regular settings

# Speeds up test execution.
# See https://brobin.me/blog/2016/08/7-ways-to-speed-up-your-django-test-suite/

# noinspection PyUnresolvedReferences
from .settings import *  # noqa: F401,F403

import logging

logging.disable(logging.CRITICAL)

DEBUG = False

TEMPLATE_DEBUG = False

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

MIDDLEWARE_CLASSES = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache"
    }
}

EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"
