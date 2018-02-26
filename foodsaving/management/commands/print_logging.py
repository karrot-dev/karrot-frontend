from django.core.management.base import BaseCommand
from logging_tree import printout


class Command(BaseCommand):
    """
    prints the configuration of the python logging module, useful for setting up/debugging loggers.
    """

    def handle(self, *args, **options):
        printout()
