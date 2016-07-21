from factory import CREATE_STRATEGY, post_generation, DjangoModelFactory, SubFactory
from yunity.conversations.models import Conversation as ConversationModel
from yunity.conversations.models import ConversationMessage as MessageModel
from yunity.users.factories import User
from yunity.utils.tests.fake import faker


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


class Message(DjangoModelFactory):
    class Meta:
        model = MessageModel

    author = SubFactory(User)
    in_conversation = SubFactory(Conversation)
    content = faker.text()
