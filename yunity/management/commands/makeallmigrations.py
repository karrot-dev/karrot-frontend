import re

from django.core.management.base import BaseCommand

from django.core.management.commands.makemigrations import Command as MakeMigrationsCommand

from config import settings


class Command(BaseCommand):
    help = 'Make all migrations'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', dest='dry_run', default=False,
            help="Just show what migrations would be made; don't actually write them.")
        parser.add_argument('--merge', action='store_true', dest='merge', default=False,
            help="Enable fixing of migration conflicts.")
        parser.add_argument('--empty', action='store_true', dest='empty', default=False,
            help="Create an empty migration.")
        parser.add_argument('--noinput', '--no-input',
            action='store_false', dest='interactive', default=True,
            help='Tells Django to NOT prompt the user for input of any kind.')
        parser.add_argument('-n', '--name', action='store', dest='name', default=None,
            help="Use this name for migration file(s).")
        parser.add_argument('-e', '--exit', action='store_true', dest='exit_code', default=False,
            help='Exit with error code 1 if no changes needing migrations are found.')

    def handle(self, *args, **options):
        app_labels = []
        for app_name in settings.INSTALLED_APPS:
            m = re.match('^yunity\.(.*)$', app_name)
            if m:
                app_labels.append(m.group(1))
        if len(app_labels) > 0:
            MakeMigrationsCommand().handle(*app_labels, **options)
        else:
            print('no apps matched yunity.*')