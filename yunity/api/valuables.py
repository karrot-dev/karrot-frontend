from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Valuables(ApiBase, View):
    def get(self, request):
        """list all valuables

        """
        raise NotImplementedError

    def post(self, request):
        """create a new valuable

        """
        raise NotImplementedError


class Valuable(ApiBase, View):
    def get(self, request, valuableid):
        """return details about valuable, including participants

        """
        raise NotImplementedError

    def put(self, request, valuableid):
        """modify the valuable

        """
        raise NotImplementedError


class ValuableWallposts(ApiBase, View):
    def get(self, request, valuableid):
        """list all messages on the wall

        """
        raise NotImplementedError

    def post(self, request, valuableid):
        """adds a message to the wall

        """
        raise NotImplementedError


class ValuableWallpost(ApiBase, View):
    def put(self, request, valuableid, wallpostid):
        """edit the message

        """
        raise NotImplementedError

    def delete(self, request, valuableid, wallpostid):
        """delete the message

        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Valuables.as_view()),
    url(r'^/(?P<valuableid>[0-9]+)/?$', Valuable.as_view()),
    url(r'^/(?P<valuableid>[0-9]+)/wallposts/?$', ValuableWallposts.as_view()),
    url(r'^/(?P<valuableid>[0-9]+)/wallposts/(?P<wallpostid>[0-9]+)/?$', ValuableWallpost.as_view()),
]
