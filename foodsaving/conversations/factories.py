from django.contrib.auth import get_user_model
from factory import DjangoModelFactory, CREATE_STRATEGY, LazyAttribute, PostGeneration

from foodsaving.conversations.models import Conversation
from foodsaving.utils.tests.fake import faker


class ConversationFactory(DjangoModelFactory):

    class Meta:
        model = Conversation
        strategy = CREATE_STRATEGY
