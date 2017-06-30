from django.core.management.base import BaseCommand

from foodsaving.groups.models import Group


class Command(BaseCommand):

    def handle(self, *args, **options):
        Group.objects.send_all_notifications()
