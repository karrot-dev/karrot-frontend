from factory import DjangoModelFactory, CREATE_STRATEGY

from foodsaving.conversations.models import Conversation


class ConversationFactory(DjangoModelFactory):
    class Meta:
        model = Conversation
        strategy = CREATE_STRATEGY
