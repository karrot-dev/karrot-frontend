import re

from django.core.management.base import BaseCommand

from django.core.management.commands.makemigrations import Command as MakeMigrationsCommand

from config import settings


class Command(BaseCommand):
    help = 'Make all migrations'

    def handle(self, *args, **options):
        app_labels = []
        for app_name in settings.INSTALLED_APPS:
            m = re.match('^yunity\.(.*)$', app_name)
            if m:
                app_labels.append(m.group(1))
        if len(app_labels) > 0:
            MakeMigrationsCommand().handle(*app_labels, verbosity=1, interactive=False)
        else:
            print('no apps matched yunity.*')