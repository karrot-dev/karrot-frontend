from yunity.api import serializers
from yunity.models import Conversation as ConversationModel
from yunity.utils.tests.abc import BaseTestCase, AnyResult


class TestSerializers(BaseTestCase):
    def test_chat_with_empty_messages_serializable(self):
       self.given_data(ConversationModel.objects.create())
       self.when_calling(serializers.conversation)
       self.then_invocation_passed_with(AnyResult())

