from django.test import TestCase
from django.utils.dateparse import parse_datetime
from yunity.conversations.factories import Message, Conversation
from yunity.conversations.serializers import MessageSerializer, ConversationSerializer
from yunity.users.factories import UserFactory


class TestMessageSerializer(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.message = Message()

    def test_instantiation(self):
        serializer = MessageSerializer(self.message)
        self.assertEqual(serializer.data['content'], self.message.content)
        self.assertEqual(serializer.data['author'], self.message.author.id)
        self.assertEqual(parse_datetime(serializer.data['time']), self.message.created_at)


class TestConversationSerializer(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.conversation = Conversation(participants=[UserFactory() for _ in range(3)])
        [Message(in_conversation=cls.conversation) for _ in range(10)]

    def test_instantiation(self):
        serializer = ConversationSerializer(self.conversation)
        self.assertEqual(serializer.data['topic'], self.conversation.topic)
        self.assertEqual(serializer.data['id'], self.conversation.id)
        self.assertEqual([_['id'] for _ in serializer.data['participants']],
                         [_.id for _ in self.conversation.participants.all()])
        self.assertEqual([_['content'] for _ in serializer.data['messages']],
                         [_.content for _ in self.conversation.messages.all()])
