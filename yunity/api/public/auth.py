from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Login(ApiBase, View):
    def get(self, request):
        """get current login status

        :type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """log in the user

        :type request: HttpRequest
        """
        raise NotImplementedError


class Logout(ApiBase, View):
    def post(self, request):
        """log out the user

        :type request: HttpRequest
        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/login/?$', Login.as_view()),
    url(r'^/logout/?$', Logout.as_view()),
]
