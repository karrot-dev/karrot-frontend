from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Users(ApiBase, View):
    def post(self, request):
        """register a new user

        """
        raise NotImplementedError


class User(ApiBase, View):
    def get(self, request, userid):
        """get details about this user

        """
        raise NotImplementedError

    def put(self, request, userid):
        """modify the user

        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Users.as_view()),
    url(r'^(?P<userid>[0-9]+)/?$', User.as_view()),
]
