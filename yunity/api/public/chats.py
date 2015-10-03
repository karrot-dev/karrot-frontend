from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.api.ids import chat_id_uri_pattern, user_id_uri_pattern

from yunity.api.utils import ApiBase


class Chats(ApiBase, View):
    def get(self, request):
        """list all chats of the user

        :type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """create new chat with some participants

        :type request: HttpRequest
        """
        raise NotImplementedError


class Chat(ApiBase, View):
    def get(self, request, chatid):
        """fetch all the information about the chat

        :type request: HttpRequest
        :type chatid: int
        """
        raise NotImplementedError


class ChatMessages(ApiBase, View):
    def get(self, request, chatid):
        """fetch all the messages in the chat

        :type request: HttpRequest
        :type chatid: int
        """
        raise NotImplementedError


class ChatParticipants(ApiBase, View):
    def get(self, request, chatid):
        """fetch all the participants in the chat

        :type request: HttpRequest
        :type chatid: int
        """
        raise NotImplementedError

    def post(self, request, chatid):
        """add a user to the chat

        :type request: HttpRequest
        :type chatid: int
        """
        raise NotImplementedError


class ChatParticipant(ApiBase, View):
    def delete(self, request, chatid, userid):
        """remove a user from the chat

        :type request: HttpRequest
        :type chatid: int
        :type userid: int
        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Chats.as_view()),
    url(r'^/{chatid}/?$'.format(chatid=chat_id_uri_pattern), Chat.as_view()),
    url(r'^/{chatid}/messages/?$'.format(chatid=chat_id_uri_pattern), ChatMessages.as_view()),
    url(r'^/{chatid}/participants/?$'.format(chatid=chat_id_uri_pattern), ChatParticipants.as_view()),
    url(r'^/{chatid}/participants/{userid}/?$'.format(chatid=chat_id_uri_pattern, userid=user_id_uri_pattern), ChatParticipant.as_view()),
]
