from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Categories(ApiBase, View):
    def get(self, request):
        """list all categories

        """
        raise NotImplementedError

    def post(self, request):
        """create a new category

        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Categories.as_view()),
]
