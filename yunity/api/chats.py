from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.utils.api import ApiBase


class Chats(ApiBase, View):
    def get(self, request):
        """list all chats of the user

        @type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """create new chat with some participants

        @type request: HttpRequest
        """
        raise NotImplementedError


class Chat(ApiBase, View):
    def get(self, request, chatid):
        """fetch all the information about the chat

        @type request: HttpRequest
        @type chatid: int
        """
        raise NotImplementedError


class ChatMessages(ApiBase, View):
    def get(self, request, chatid):
        """fetch all the messages in the chat

        @type request: HttpRequest
        @type chatid: int
        """
        raise NotImplementedError


class ChatParticipants(ApiBase, View):
    def get(self, request, chatid):
        """fetch all the participants in the chat

        @type request: HttpRequest
        @type chatid: int
        """
        raise NotImplementedError

    def post(self, request, chatid):
        """add a user to the chat

        @type request: HttpRequest
        @type chatid: int
        """
        raise NotImplementedError


class ChatParticipant(ApiBase, View):
    def delete(self, request, chatid, userid):
        """remove a user from the chat

        @type request: HttpRequest
        @type chatid: int
        @type userid: int
        """
        raise NotImplementedError

chatid = r'(?P<chatid>[0-9]+)'
userid = r'(?P<userid>[0-9]+)'

urlpatterns = [
    url(r'^/?$', Chats.as_view()),
    url(r'^/{chatid}/?$'.format(chatid=chatid), Chat.as_view()),
    url(r'^/{chatid}/messages/?$'.format(chatid=chatid), ChatMessages.as_view()),
    url(r'^/{chatid}/participants/?$'.format(chatid=chatid), ChatParticipants.as_view()),
    url(r'^/{chatid}/participants/{userid}/?$'.format(chatid=chatid, userid=userid), ChatParticipant.as_view()),
]
