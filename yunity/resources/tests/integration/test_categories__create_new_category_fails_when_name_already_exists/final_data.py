from yunity.models import Category as CategoryModel
from .initial_data import existing_category

new_category = CategoryModel.objects.filter(name=existing_category.name)
assert len(new_category) == 1, 'category with duplicate name got created'
