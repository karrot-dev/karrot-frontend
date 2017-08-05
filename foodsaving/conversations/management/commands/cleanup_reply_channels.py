from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand
from django.utils import timezone

from foodsaving.conversations.models import ConversationReplyChannel


class Command(BaseCommand):
    """If we have not received a message on the ConversationReplyChannel for a while, we delete our entries."""

    def handle(self, *args, **options):
        def print(*args):
            self.stdout.write(' '.join([str(_) for _ in args]))

        def print_success(*args):
            self.stdout.write(self.style.SUCCESS(' '.join(str(_) for _ in args)))

        ConversationReplyChannel.objects.filter(lastseen_at__lt=timezone.now() - relativedelta(minutes=5)).delete()

        print('done')
