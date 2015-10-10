from yunity.models import Category as CategoryModel
from .request import request

new_category = CategoryModel.objects.filter(name=request['body']['name'])
assert len(new_category) == 0, 'category with non-existing parent got created'
