from yunity.base.other_models import Item as ItemModel

item = ItemModel.objects.filter(description="my lovely test item")
assert not item.exists(), "Item does exist"
