#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

    from django.core.management import execute_from_command_line
    from django.conf import settings

    if 'test' in sys.argv:
        """Speed up test execution.

        From these tips:
          https://brobin.me/blog/2016/08/7-ways-to-speed-up-your-django-test-suite/

        """
        import logging

        logging.disable(logging.CRITICAL)
        settings.DEBUG = False
        settings.TEMPLATE_DEBUG = False
        settings.PASSWORD_HASHERS = [
            'django.contrib.auth.hashers.MD5PasswordHasher',
        ]
        settings.MIDDLEWARE_CLASSES = [
            'django.contrib.sessions.middleware.SessionMiddleware',
            'django.middleware.csrf.CsrfViewMiddleware',
            'django.contrib.auth.middleware.AuthenticationMiddleware',
            'django.contrib.messages.middleware.MessageMiddleware',
        ]
        settings.CACHES['default']['BACKEND'] = 'django.core.cache.backends.locmem.LocMemCache'
        settings.EMAIL_BACKEND = "django.core.mail.backends.dummy.EmailBackend"

    execute_from_command_line(sys.argv)
