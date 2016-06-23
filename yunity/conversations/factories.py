from factory import CREATE_STRATEGY, post_generation, DjangoModelFactory
from yunity.conversations.models import Conversation as ConversationModel


class Conversation(DjangoModelFactory):
    class Meta:
        model = ConversationModel
        strategy = CREATE_STRATEGY

    @post_generation
    def participants(self, created, participants, **kwargs):
        if not created:
            return
        if participants:
            for participant in participants:
                self.participants.add(participant)