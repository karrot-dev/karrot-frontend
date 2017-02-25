from factory import post_generation, DjangoModelFactory, SubFactory, LazyAttribute
from foodsaving.conversations.models import Conversation as ConversationModel
from foodsaving.conversations.models import ConversationMessage as MessageModel
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


class Conversation(DjangoModelFactory):
    class Meta:
        model = ConversationModel

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

    author = SubFactory(UserFactory)
    in_conversation = SubFactory(Conversation)
    content = LazyAttribute(lambda x: faker.text())
