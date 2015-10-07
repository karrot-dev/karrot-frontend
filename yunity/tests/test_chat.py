from . import factories as f
from django.test import TestCase
from yunity.api.public.chats import Chat as ChatView
from yunity.api.public.chats import Chats as ChatsView
from yunity.api.public.chats import ChatMessages as ChatMessagesView
from yunity.api.public.chats import ChatParticipant as ChatParticipantView
from yunity.api.public.chats import ChatParticipants as ChatParticipantsView
from yunity.models import User as UserModel
from yunity.models import Message as MessageModel
from yunity.models import Chat as ChatModel
from yunity.tests.utils import JsonRequestFactory, content_json

import yunity.utils.status as status

class ChatTestCase(TestCase):

    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = JsonRequestFactory()
        self.ChatView = ChatView.as_view()
        self.ChatsView = ChatsView.as_view()
        self.ChatMessagesView = ChatMessagesView.as_view()
        self.ChatParticipantsView = ChatParticipantsView.as_view()
        self.ChatParticipantView = ChatParticipantView.as_view()

        self.users = f.UserFactory.create_batch(4)
        self.chatadmins = f.UserFactory.create_batch(2)

    def test_create_chat(self):
        create_chat_body = {"participants": [self.users[0].id, self.users[1].id]}
        request = self.factory.post('/api/chats', create_chat_body)
        request.user = self.users[0]
        response = self.ChatsView(request)
        assert(response.status_code == status.HTTP_201_CREATED)
        chatid = content_json(response)["id"]
        chatdb = ChatModel.objects.get(id=chatid)
        assert(chatdb.participants.filter(id=self.users[0].id).exists())
        assert(chatdb.participants.filter(id=self.users[1].id).exists())

    def test_get_chat_messages(self):
        pass

    def test_post_chat_message(self):
        pass

    def test_add_chat_participants(self):
        pass

    def test_delete_chat_participant(self):
        pass

    def test_get_chat_participants(self):
        pass



