from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Participates(ApiBase, View):
    def get(self, request):
        """list all participates of this user

        """
        raise NotImplementedError

    def post(self, request):
        """create a new participate

        """
        raise NotImplementedError


class Participate(ApiBase, View):
    def get(self, request, participateid):
        """return details about this participate

        """
        raise NotImplementedError

    def put(self, request, participateid):
        """modify the participate, e.g. approve it

        """
        raise NotImplementedError

    def delete(self, request, participateid):
        """unrequest the participate

        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Participates.as_view()),
    url(r'^(?P<participateid>[0-9]+)/?$', Participate.as_view()),
]
