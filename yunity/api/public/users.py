from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.utils.api import ApiBase


class Users(ApiBase, View):
    def post(self, request):
        """register a new user

        :type request: HttpRequest
        """
        raise NotImplementedError


class User(ApiBase, View):
    def get(self, request, userid):
        """get details about this user

        :type request: HttpRequest
        :type userid: int
        """
        raise NotImplementedError

    def put(self, request, userid):
        """modify the user

        :type request: HttpRequest
        :type userid: int
        """
        raise NotImplementedError


userid = r'(?P<userid>[0-9]+)'

urlpatterns = [
    url(r'^/?$', Users.as_view()),
    url(r'^{userid}/?$'.format(userid=userid), User.as_view()),
]
