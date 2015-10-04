from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.utils import ApiBase, json_post, model_to_json
from yunity.models import Category as CategoryModel


def category_to_json(category):
    return model_to_json(category, 'name', 'id', 'parent')


class Categories(ApiBase, View):
    def get(self, request):
        """List all categories.

        response_json:
            categories:
                type: list
                description: a list of {'name', 'id', 'parent'} objects describing all the categories

        :type request: HttpRequest
        :rtype JsonResponse

        """
        categories = CategoryModel.objects.all()

        return self.success({'categories': [category_to_json(_) for _ in categories]})

    @json_post(expected_keys=['name'])
    def post(self, data, request):
        """Creates a new category.

        request_json:
            name:
                type: string
                required: true
                description: the name of the category to create
            parent:
                type: integer
                description: the id of the category under which to nest the new category

        response_json:
            id:
                type: integer
                description: the id of the newly created category

        :type data: dict
        :type request: HttpRequest
        :rtype JsonResponse

        """
        name = data['name']
        parent = data.get('parent')
        if parent is not None:
            parent = CategoryModel.objects.get(id=parent)

        category = CategoryModel.objects.create(name=name, parent=parent)
        return self.success({'id': category.id})


urlpatterns = [
    url(r'^$', Categories.as_view()),
]
