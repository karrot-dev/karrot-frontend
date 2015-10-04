from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.api.ids import category_ids_uri_pattern

from yunity.api.utils import ApiBase, post_with_json_body, get_with_list_param
from yunity.models import Category as CategoryModel


def category_from(name, parent=None):
    """
    :type name: str
    :type parent: str
    :rtype: CategoryModel
    """
    parent = CategoryModel.objects.get(id=parent) if parent is not None else None
    return CategoryModel.objects.create(name=name, parent=parent)


class Categories(ApiBase, View):
    def get(self, request):
        """List all categories.

        response_json:
            categories:
                type: list
                description: a list of {'id': integer} objects describing all the categories

        :type request: HttpRequest
        :rtype JsonResponse

        """
        categories = CategoryModel.objects.all()

        return self.success({'categories': [{
            'id': _.id,
        } for _ in categories]})

    @post_with_json_body(expected_keys=['categories'])
    def post(self, request, data):
        """Creates a new category.

        request_json:
            categories:
                type: list
                required: true
                description: a list of {'name': string, 'parent': integer} objects of the categories to create

        response_json:
            categories:
                type: list
                description: a list of {'id': integer} objects describing the newly created categories

        :type data: dict
        :type request: HttpRequest
        :rtype JsonResponse

        """
        categories = [category_from(name=category.get('name'), parent=category.get('parent'))
                      for category in data.get('categories', [])]

        return self.success({'categories': [{
            'id': _.id,
        } for _ in categories]})


class Category(ApiBase, View):
    @get_with_list_param('categoryids', item_type=int)
    def get(self, request, categoryids):
        """Describe one or more categories.

        response_json:
            categories:
                type: list
                description: a list of {'id': integer, 'name': string, 'parent': integer} objects describing the categories

        :type request: HttpRequest
        :type categoryids: list
        :rtype JsonResponse

        """
        categories = CategoryModel.objects \
            .filter(id__in=categoryids) \
            .all()

        return self.success({'categories': [{
            'id': _.id,
            'name': _.name,
            'parent': _.parent_id,
        } for _ in categories]})


urlpatterns = [
    url(r'^$', Categories.as_view()),
    url(r'^/{categoryids}/?$'.format(categoryids=category_ids_uri_pattern), Category.as_view()),
]
