from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.validation import validate_category_name, validate_category_parent
from yunity.utils.api.abc import ApiBase, body_as_json
from yunity.utils.api.request import Parameter
from yunity.models import Category as CategoryModel
from yunity.utils.status import HTTP_409_CONFLICT


def _category_exists(category_id):
    return CategoryModel.objects.filter(id=category_id).exists()


def _category_name_exists(category_name):
    return CategoryModel.objects.filter(name=category_name).exists()


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
        Parameter(name='name', validator=validate_category_name),
        Parameter(name='parent', validator=validate_category_parent),
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
        if _category_name_exists(request.body['name']):
            return self.error(reason='category name already exists', status=HTTP_409_CONFLICT)
        if not _category_exists(request.body['parent']):
            return self.error(reason='parent category does not exist')

        new_category = CategoryModel.objects.create(name=request.body['name'], parent_id=request.body['parent'])

        return self.created({
            'id': new_category.id,
        })


urlpatterns = [
    url(r'^/$', Categories.as_view()),
]
