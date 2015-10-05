from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.api.ids import category_ids_uri_pattern

from yunity.api.utils import ApiBase, body_as_json, resource_as_list
from yunity.models import Category as CategoryModel


def category_from(name, parent=None):
    """
    :type name: str
    :type parent: str
    :rtype: CategoryModel

    """
    parent = CategoryModel.objects.get(id=parent) if parent is not None else None
    return CategoryModel.objects.create(name=name, parent=parent)


def categories_from(categories):
    """
    :type categories: list
    :rtype: list

    """
    # TODO: Maybe change implementation to `bulk_create` at some point...
    return [category_from(_.get('name'), _.get('parent')) for _ in categories]


class Categories(ApiBase, View):
    def get(self, request):
        """List all categories.
        ---
        responses:
            200:
                description: A list of all existing categories.
                schema:
                    type: object
                    properties:
                        categories:
                            type: array
                            items:
                                type: object
                                properties:
                                    id:
                                        type: integer
                                    name:
                                        type: string
                                    parent:
                                        type: integer

        ...

        :type request: HttpRequest
        :rtype JsonResponse

        """
        categories = CategoryModel.objects.all()

        return self.success({'categories': [{
            'id': _.id,
            'name': _.name,
            'parent': _.parent_id,
        } for _ in categories]})

    @body_as_json(expected_keys=['categories'])
    def post(self, request):
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

        :type request: HttpRequest
        :rtype JsonResponse

        """
        categories = categories_from(request.body.get('categories', []))

        return self.created({'categories': [{
            'id': _.id,
        } for _ in categories]})


class Category(ApiBase, View):
    @resource_as_list('categoryids', item_type=int)
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
    url(r'^/$', Categories.as_view()),
    url(r'^/{categoryids}/?$'.format(categoryids=category_ids_uri_pattern), Category.as_view()),
]
