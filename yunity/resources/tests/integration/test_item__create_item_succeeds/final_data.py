from yunity.models.concrete import Item as ItemModel

item = ItemModel.objects.filter(description="my lovely test item")
assert item.exists(), "Item does not exist"