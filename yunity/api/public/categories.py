from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

from yunity.api import types, serializers
from yunity.utils.api.abc import ApiBase
from yunity.utils.api.decorators import json_request, request_parameter
from yunity.models import Category as CategoryModel


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

        return self.success({'categories': [serializers.category(category) for category in categories]})

    @json_request
    @request_parameter('name', of_type=types.category_name)
    @request_parameter('parent', of_type=types.category_parent)
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
        new_category = CategoryModel.objects.create(name=request.body['name'], parent_id=request.body['parent'])

        return self.created({
            'id': new_category.id,
        })


urlpatterns = [
    url(r'^/$', Categories.as_view()),
]
