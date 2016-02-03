from yunity.api import serializers
from yunity.conversations.models import Conversation as ConversationModel
from yunity.utils.tests.abc import BaseRequestTestCase, AnyResult


class TestSerializers(BaseRequestTestCase):
    def test_chat_with_empty_messages_serializable(self):
        self.given_data(ConversationModel.objects.create())
        self.when_calling(serializers.conversation)
        self.then_invocation_passed_with(AnyResult())
