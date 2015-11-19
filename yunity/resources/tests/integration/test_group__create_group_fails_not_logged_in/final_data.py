from yunity.models.concrete import Group as GroupModel

group = GroupModel.objects.filter(name="test group name", description="test group description")
assert not group.exists(), "Group does exist"
