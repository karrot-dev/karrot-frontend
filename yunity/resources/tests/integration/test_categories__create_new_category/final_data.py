from yunity.models import Category as CategoryModel
from .request import request

new_category = CategoryModel.objects.filter(name=request['body']['name'])
assert len(new_category) == 1, 'new category did not get created'
