from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.utils.api import ApiBase


class Participates(ApiBase, View):
    def get(self, request):
        """list all participates of this user

        :type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """create a new participate

        :type request: HttpRequest
        """
        raise NotImplementedError


class Participate(ApiBase, View):
    def get(self, request, participateid):
        """return details about this participate

        :type request: HttpRequest
        :type participateid: int
        """
        raise NotImplementedError

    def put(self, request, participateid):
        """modify the participate, e.g. approve it

        :type request: HttpRequest
        :type participateid: int
        """
        raise NotImplementedError

    def delete(self, request, participateid):
        """unrequest the participate

        :type request: HttpRequest
        :type participateid: int
        """
        raise NotImplementedError


participateid = r'(?P<participateid>[0-9]+)'

urlpatterns = [
    url(r'^/?$', Participates.as_view()),
    url(r'^{participateid}/?$'.format(participateid=participateid), Participate.as_view()),
]
