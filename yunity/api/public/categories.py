from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.ids import category_ids_uri_pattern
from yunity.api.validation import validate_categories
from yunity.utils.api.abc import ApiBase, body_as_json, resource_as_list
from yunity.utils.api.request import Parameter
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
        tags:
          - Categories
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

    @body_as_json(parameters=[
        Parameter(name='categories', validator=validate_categories),
    ])
    def post(self, request):
        """Creates a new category.
        ---
        tags:
            - Categories
        parameters:
            - in: body
              name: body
              schema:
                  id: create_category
                  required:
                    - name
                    - parent
                  properties:
                      name:
                          type: string
                          description: Name of the categorie
                          example: Yunity-Project XY Store
                      parent:
                          type: number
                          description: ID of the parent category
                          example: 1234
        responses:
            201:
                description: Category created
                schema:
                    id: category_id_response
                    type: object
                    properties:
                        id:
                            type: integer
                            description: ID of newly created category
                            example: 7143
            409:
                description: Category name already exists
            400:
                description: Parent category does not exist
        ...

        :type request: HttpRequest
        :rtype JsonResponse

        """
        categories = categories_from(request.body.get('categories', []))

        return self.created({'categories': [{
            'id': _.id,
        } for _ in categories]})


urlpatterns = [
    url(r'^/$', Categories.as_view()),
]
