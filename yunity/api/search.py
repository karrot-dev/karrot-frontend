from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Search(ApiBase, View):
    def get(self, request):
        """execute the search

        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Search.as_view()),
]
