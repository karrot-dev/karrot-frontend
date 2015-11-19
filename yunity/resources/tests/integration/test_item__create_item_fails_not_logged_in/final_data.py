from yunity.models.concrete import Item as ItemModel

item = ItemModel.objects.filter(description="my lovely test item")
assert not item.exists(), "Item does exist"