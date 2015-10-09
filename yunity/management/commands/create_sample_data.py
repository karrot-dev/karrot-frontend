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

from yunity.models import *


def _datetime(fmt):
    return make_aware(datetime.strptime(fmt, '%Y-%m-%d %H:%M'))


##################################################
# category
##################################################

category_foodsharing = Category.objects.create(name='foodsharing')
category_user = Category.objects.create(name='user')
category_foodsharing_company = Category.objects.create(name='company', parent=category_foodsharing)
category_foodsharing_foodbasket = Category.objects.create(name='basket', parent=category_foodsharing)


##################################################
# user
##################################################

user_tilmann = User.objects.create(
    email='til@man.com',
    display_name='Mr T',
    name='tilmann',
    type=category_user,
    provenance='yunity.org',
    locations=[{"latitude": 0.1, "longitude": 42.1, "description": "home address"}]
)

user_matthias = User.objects.create(email='mat@hias.com', display_name='Matthias',
                                    name='matthias', type=category_user, provenance='yunity.org',
                                    locations=[{"latitude": 0.1, "longitude": 42.1, "description": "home address"}])

user_neel = User.objects.create(email='ne@el.com', display_name='Neel', name='neel', type=category_user, provenance='yunity.org',
                                locations=[{"latitude": 0.1, "longitude": 42.1, "description": "home address"}])

user_flo = User.objects.create(email='f@lo.com', display_name='Flo', name='flo', type=category_user, provenance='yunity.org',
                               locations=[{"latitude": 0.1, "longitude": 42.1, "description": "home address"}])


##################################################
# use-case: foodsharing store
##################################################

foodsharing_store = Opportunity.objects.create(
    provenance='yunity.org',
    name='alnatura',
    type=category_foodsharing_company,
    locations=[{"latitude": 0.1, "longitude": 42.1, "description": "home address"}]
)
foodsharing_store.administrated_by.add(user_tilmann, user_matthias)

foodsharing_store_wall = Wall.objects.create(target=foodsharing_store)
Message.objects.create(type='text', content="hey guys, i can't make the pickup today :(", sent_by=user_neel, in_conversation=foodsharing_store_wall)

Participate.objects.create(requested_by=user_neel, target=foodsharing_store, status='granted', type='team')
Participate.objects.create(requested_by=user_flo, target=foodsharing_store, status='granted', type='team')

Participate.objects.create(requested_by=user_flo, target=foodsharing_store, status='granted', type='picker', time=_datetime('2015-10-15 17:00'))
Participate.objects.create(requested_by=user_neel, target=foodsharing_store, status='requested', type='picker', time=_datetime('2015-10-14 17:00'))
Participate.objects.create(requested_by=user_neel, target=foodsharing_store, status='requested', type='picker', time=_datetime('2015-10-13 17:00'))
Participate.objects.create(requested_by=None, target=foodsharing_store, type='picker', time=_datetime('2015-10-12 17:00'))


##################################################
# use-case: food basket
##################################################

foodsharing_basket = Valuable.objects.create(
    provenance='foodsharing.de',
    name='super tasty bananas and bread',
    type=category_foodsharing_foodbasket,
    locations=[{"latitude": 0.1, "longitude": 42.1, "description": "home address"}]
)
foodsharing_basket.administrated_by.add(user_tilmann)

foodsharing_basket_wall = Wall.objects.create(target=foodsharing_basket)
Message.objects.create(type='text', content='please pick up my super tasty stuff', sent_by=user_tilmann, in_conversation=foodsharing_basket_wall)
Message.objects.create(type='picture', content='yunity.org/pics/mybasket.png', sent_by=user_tilmann, in_conversation=foodsharing_basket_wall)

Take.objects.create(requested_by=user_neel, target=foodsharing_basket)
Take.objects.create(requested_by=user_matthias, target=foodsharing_basket)


##################################################
# use-case: chat
##################################################

num_chat_messages = 10

chat_pair = Chat.objects.create()
chat_pair.participants.add(user_neel, user_tilmann)
for i in range(num_chat_messages):
    Message.objects.create(content="Hi Neel, lorem ipsum {}".format(i), type='text', sent_by=user_tilmann, in_conversation=chat_pair)
    Message.objects.create(content="Hi Tilmann, lorem ipsum {}".format(i), type='text', sent_by=user_neel, in_conversation=chat_pair)

chat_group = Chat.objects.create()
chat_group.participants.add(user_matthias, user_flo, user_tilmann)
for i in range(num_chat_messages):
    Message.objects.create(content="Hi all, lorem ipsum {}".format(i), type='text', sent_by=user_matthias, in_conversation=chat_group)
    Message.objects.create(content="Hi too, lorem ipsum {}".format(i), type='text', sent_by=user_flo, in_conversation=chat_group)
    Message.objects.create(content="Bla, lorem ipsum {}".format(i), type='text', sent_by=user_tilmann, in_conversation=chat_group)
