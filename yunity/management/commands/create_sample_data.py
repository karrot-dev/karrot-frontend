"""This script sets up some test-data representing some of the use-cases in the app:

Food store
========================

Matthias and tilmann talked with Jon who is the manager of the Alnatura organic shop in Munich. The trio would like to
start saving food from the Alnatura store, so Matthias and tilmann create an entry for the store and gather a team to
organize the rescue: Neel and Flo will help with picking up food.
As such, on the 15th of October at 5pm, Flo will be picking up some food from the store. Neel signed up for the pick-ups
on the 13th and 14th but he hasn't been given the go-ahead yet. Unfortunately, Neel can't make the pick-up on the 12th
for which he was originally down (he told the group as much in a message) and no one volunteered to take over his slot.
If anyone has questions about the way that the group organizes pickups from the store, they decide that people should
contact tilmann via direct message.


Food basket
========================

tilmann wants to get rid of 5.1 kg of "super tasty" bananas and bread. He advertises the basket with a picture.
Our bestower of tastiness is very busy, meaning that the food can only be picked up on October 15th 2015. The pick up
can happen at tilmann's office in Munich (between 5pm and 6pm) or at his home between 7pm and 8pm.
Neel and Matthias showed interest in picking up the food and tilmann chose to give the food to Neel. The pick up went
seamlessly so tilmann left some positive feedback on Neel.

Chat
========================

Neel chats lorem ipsum with tilmann, while Flo, Matthias and tilmann have a group chat discussion about lorem ipsum.

"""
from datetime import datetime

from django.utils.timezone import make_aware

from yunity.conversations.models import ConversationMessage, Conversation, ConversationType
from yunity.users.models import User

from django.core.management.base import BaseCommand

def _datetime(fmt):
    return make_aware(datetime.strptime(fmt, '%Y-%m-%d %H:%M'))

class Command(BaseCommand):
    def handle(self, *args, **options):
        ##################################################
        # user
        ##################################################

        user_tilmann = User.objects.create(
            email='til@man.com',
            display_name='Mr T',
            first_name='tilmann',
            last_name='becker'
        )

        user_matthias = User.objects.create_user(email='mat@hias.com', display_name='Matthias', first_name='matthias',
                                            last_name='lar', password='abc')

        user_neel = User.objects.create_user(email='ne@el.com', display_name='Neel', first_name='neel', last_name='neel',
                                        password='abc')


        user_flo = User.objects.create_user(email='f@lo.com', display_name='Flo', first_name='flo', last_name='g',
                                       password='abc')

        num_chat_messages = 10

        chat_pair = Conversation.objects.create()
        chat_pair.participants.add(user_neel, user_tilmann)
        for i in range(num_chat_messages):
            ConversationMessage.objects.create(content="Hi Neel, lorem ipsum {}".format(i), author=user_tilmann,
                                               in_conversation=chat_pair)
            ConversationMessage.objects.create(content="Hi Tilmann, lorem ipsum {}".format(i), author=user_neel,
                                               in_conversation=chat_pair)

        chat_group = Conversation.objects.create(type=ConversationType.MULTICHAT, topic="Matthias, Flo und Tilmann")
        chat_group.participants.add(user_matthias, user_flo, user_tilmann)
        for i in range(num_chat_messages):
            ConversationMessage.objects.create(content="Hi all, lorem ipsum {}".format(i), author=user_matthias,
                                               in_conversation=chat_group)
            ConversationMessage.objects.create(content="Hi too, lorem ipsum {}".format(i), author=user_flo,
                                               in_conversation=chat_group)
            ConversationMessage.objects.create(content="Bla, lorem ipsum {}".format(i), author=user_tilmann,
                                               in_conversation=chat_group)
