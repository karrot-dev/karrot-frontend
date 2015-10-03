from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.utils.api import ApiBase


class Valuables(ApiBase, View):
    def get(self, request):
        """list all valuables

        @type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """create a new valuable

        @type request: HttpRequest
        """
        raise NotImplementedError


class Valuable(ApiBase, View):
    def get(self, request, valuableid):
        """return details about valuable, including participants

        @type request: HttpRequest
        @type valuableid: int
        """
        raise NotImplementedError

    def put(self, request, valuableid):
        """modify the valuable

        @type request: HttpRequest
        @type valuableid: int
        """
        raise NotImplementedError


class ValuableWallposts(ApiBase, View):
    def get(self, request, valuableid):
        """list all messages on the wall

        @type request: HttpRequest
        @type valuableid: int
        """
        raise NotImplementedError

    def post(self, request, valuableid):
        """adds a message to the wall

        @type request: HttpRequest
        @type valuableid: int
        """
        raise NotImplementedError


class ValuableWallpost(ApiBase, View):
    def put(self, request, valuableid, wallpostid):
        """edit the message

        @type request: HttpRequest
        @type valuableid: int
        @type wallpostid: int
        """
        raise NotImplementedError

    def delete(self, request, valuableid, wallpostid):
        """delete the message

        @type request: HttpRequest
        @type valuableid: int
        @type wallpostid: int
        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Valuables.as_view()),
    url(r'^/(?P<valuableid>[0-9]+)/?$', Valuable.as_view()),
    url(r'^/(?P<valuableid>[0-9]+)/wallposts/?$', ValuableWallposts.as_view()),
    url(r'^/(?P<valuableid>[0-9]+)/wallposts/(?P<wallpostid>[0-9]+)/?$', ValuableWallpost.as_view()),
]
