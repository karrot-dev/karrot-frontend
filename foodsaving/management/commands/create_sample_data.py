from datetime import datetime

from django.contrib.auth import get_user_model
from django.utils.timezone import make_aware

from foodsaving.conversations.models import ConversationMessage, Conversation, ConversationType

from django.core.management.base import BaseCommand


def _datetime(fmt):
    return make_aware(datetime.strptime(fmt, '%Y-%m-%d %H:%M'))


class Command(BaseCommand):

    def handle(self, *args, **options):
        User = get_user_model()
        ##################################################
        # user
        ##################################################

        user_tilmann = User.objects.create(
            email='til@man.com',
            display_name='Mr T',
            password='abc'
        )

        user_matthias = User.objects.create_user(email='mat@hias.com', display_name='Matthias',
                                                 password='abc')

        user_neel = User.objects.create_user(email='ne@el.com', display_name='Neel',
                                             password='abc')

        user_flo = User.objects.create_user(email='f@lo.com', display_name='Flo',
                                            password='abc')

        num_chat_messages = 10

        chat_pair = Conversation.objects.create()
        chat_pair.participants.add(user_neel, user_tilmann)
        for i in range(num_chat_messages):
            ConversationMessage.objects.create(content="Hi Neel, lorem ipsum {}".format(i), author=user_tilmann,
                                               in_conversation=chat_pair)
            ConversationMessage.objects.create(content="Hi Tilmann, lorem ipsum {}".format(i), author=user_neel,
                                               in_conversation=chat_pair)

        chat_group = Conversation.objects.create(
            type=ConversationType.MULTICHAT, topic="Matthias, Flo und Tilmann")
        chat_group.participants.add(user_matthias, user_flo, user_tilmann)
        for i in range(num_chat_messages):
            ConversationMessage.objects.create(content="Hi all, lorem ipsum {}".format(i), author=user_matthias,
                                               in_conversation=chat_group)
            ConversationMessage.objects.create(content="Hi too, lorem ipsum {}".format(i), author=user_flo,
                                               in_conversation=chat_group)
            ConversationMessage.objects.create(content="Bla, lorem ipsum {}".format(i), author=user_tilmann,
                                               in_conversation=chat_group)
