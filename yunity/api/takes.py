from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Takes(ApiBase, View):
    def get(self, request):
        """list all takes of this user

        """
        raise NotImplementedError

    def post(self, request):
        """create a new take

        """
        raise NotImplementedError


class Take(ApiBase, View):
    def get(self, request, takeid):
        """return details about this take

        """
        raise NotImplementedError

    def put(self, request, takeid):
        """modify the take, e.g. approve it

        """
        raise NotImplementedError

    def delete(self, request, takeid):
        """unrequest the take

        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Takes.as_view()),
    url(r'^(?P<takeid>[0-9]+)/?$', Take.as_view()),
]
