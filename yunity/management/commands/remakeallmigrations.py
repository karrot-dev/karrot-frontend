import re

import shutil
from os.path import join, isdir

from django.apps import apps
from django.core.management.base import BaseCommand
from yunity.management.commands.makeallmigrations import Command as MakeAllMigrationsCommand

from config import settings


class Command(BaseCommand):
    help = 'Remake all migrations'

    def handle(self, *args, **options):
        app_labels = []
        for app_name in settings.INSTALLED_APPS:
            m = re.match('^yunity\.(.*)$', app_name)
            if m:
                app_labels.append(m.group(1))
        if len(app_labels) > 0:
            for app_label in app_labels:
                path = join(apps.get_app_config(app_label).path, 'migrations')
                if isdir(path):
                    shutil.rmtree(path)
            MakeAllMigrationsCommand().handle(*app_labels, **options)
        else:
            print('no apps matched yunity.*')
