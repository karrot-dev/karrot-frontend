from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.utils import ApiBase


class Categories(ApiBase, View):
    def get(self, request):
        """list all categories

        :type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """create a new category

        :type request: HttpRequest
        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Categories.as_view()),
]
