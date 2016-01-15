from yunity.base.other_models import Item as ItemModel

item = ItemModel.objects.filter(description="my lovely test item")
assert item.exists(), "Item does not exist"
