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


urlpatterns = [
    url(r'^/?$', Chats.as_view()),
    url(r'^/(?P<chatid>[0-9]+)/?$', Chat.as_view()),
    url(r'^/(?P<chatid>[0-9]+)/messages/?$', ChatMessages.as_view()),
    url(r'^/(?P<chatid>[0-9]+)/participants/?$', ChatParticipants.as_view()),
    url(r'^/(?P<chatid>[0-9]+)/participants/(?P<userid>[0-9]+)/?$', ChatParticipant.as_view()),
]
