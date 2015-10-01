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
# location
##################################################

munich1 = Location.objects.create(latitude=48.13, longitude=11.57)
munich2 = Location.objects.create(latitude=48.161552, longitude=11.644833)
munich3 = Location.objects.create(latitude=48.161552, longitude=11.642)


##################################################
# user
##################################################

user_tilmann = User.objects.create(displayName='Mr T', name='tilmann', category=category_user, provenance='yunity.org')
user_tilmann.administratedBy.add(user_tilmann)
MappableLocation.objects.create(mappable=user_tilmann, location=munich2)
MappableLocation.objects.create(mappable=user_tilmann, location=munich3)

user_matthias = User.objects.create(displayName='Matthias', name='matthias', category=category_user, provenance='yunity.org')
user_matthias.administratedBy.add(user_matthias)

user_neel = User.objects.create(displayName='Neel', name='neel', category=category_user, provenance='yunity.org')
user_neel.administratedBy.add(user_neel)

user_flo = User.objects.create(displayName='Flo', name='flo', category=category_user, provenance='yunity.org')
user_flo.administratedBy.add(user_flo)


##################################################
# contact
##################################################

contact_tilmann_pm = Contact.objects.create(type='direct', value=user_tilmann.id)
contact_tilmann_email = Contact.objects.create(type='email', value='tilmann@foodsharing.de')
user_tilmann.contact.add(contact_tilmann_pm)
user_tilmann.contact.add(contact_tilmann_email)


##################################################
# message
##################################################

message_neel_cantcome = Message.objects.create(type='text', content="hey guys, i can't make the pickup today :(", sentBy=user_neel)
message_tilmann_basketdescription = Message.objects.create(type='text', content='please pick up my super tasty stuff', sentBy=user_tilmann)
message_tilmann_basketpicture = Message.objects.create(type='picture', content='yunity.org/pics/mybasket.png', sentBy=user_tilmann)


##################################################
# use-case: foodsharing store
##################################################

foodsharing_store = Opportunity.objects.create(provenance='yunity.org', name='alnatura', category=category_foodsharing_company)
foodsharing_store.contact.add(contact_tilmann_pm)
foodsharing_store.administratedBy.add(user_tilmann, user_matthias)
MappableLocation.objects.create(mappable=foodsharing_store, location=munich1)

foodsharing_store_wall = Wall.objects.create(target=foodsharing_store)
foodsharing_store_wall.messages.add(message_neel_cantcome)

Participate.objects.create(user=user_neel, target=foodsharing_store, status='granted', type='team')
Participate.objects.create(user=user_flo, target=foodsharing_store, status='granted', type='team')

Participate.objects.create(user=user_flo, target=foodsharing_store, status='granted', type='picker', time=_datetime('2015-10-15 17:00'))
Participate.objects.create(user=user_neel, target=foodsharing_store, status='requested', type='picker', time=_datetime('2015-10-14 17:00'))
Participate.objects.create(user=user_neel, target=foodsharing_store, status='requested', type='picker', time=_datetime('2015-10-13 17:00'))
Participate.objects.create(user=None, target=foodsharing_store, type='picker', time=_datetime('2015-10-12 17:00'))


##################################################
# use-case: food basket
##################################################

foodsharing_basket = Valueable.objects.create(provenance='foodsharing.de', name='super tasty bananas and bread', category=category_foodsharing_foodbasket)
foodsharing_basket.contact.add(contact_tilmann_email)
foodsharing_basket.administratedBy.add(user_tilmann)
MappableLocation.objects.create(mappable=foodsharing_basket, location=munich2, startTime=_datetime('2015-10-15 17:00'), endTime=_datetime('2015-10-15 18:00'))
MappableLocation.objects.create(mappable=foodsharing_basket, location=munich3, startTime=_datetime('2015-10-15 19:00'), endTime=_datetime('2015-10-15 20:00'))

foodsharing_basket_wall = Wall.objects.create(target=foodsharing_basket)
foodsharing_basket_wall.messages.add(message_tilmann_basketdescription, message_tilmann_basketpicture)

Take.objects.create(user=user_neel, target=foodsharing_basket)
Take.objects.create(user=user_matthias, target=foodsharing_basket)


##################################################
# use-case: chat
##################################################

num_chat_messages = 10

chat_pair = Chat.objects.create()
chat_pair.participants.add(user_neel, user_tilmann)
for i in range(num_chat_messages):
    chat_pair.messages.add(Message.objects.create(content="Hi Neel, lorem ipsum {}".format(i), type='text', sentBy=user_tilmann))
    chat_pair.messages.add(Message.objects.create(content="Hi Tilmann, lorem ipsum {}".format(i), type='text', sentBy=user_neel))

chat_group = Chat.objects.create()
chat_group.participants.add(user_matthias, user_flo, user_tilmann)
for i in range(num_chat_messages):
    chat_group.messages.add(Message.objects.create(content="Hi all, lorem ipsum {}".format(i), type='text', sentBy=user_matthias))
    chat_group.messages.add(Message.objects.create(content="Hi too, lorem ipsum {}".format(i), type='text', sentBy=user_flo))
    chat_group.messages.add(Message.objects.create(content="Bla, lorem ipsum {}".format(i), type='text', sentBy=user_tilmann))
