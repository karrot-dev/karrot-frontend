from yunity.models.concrete import Group as GroupModel
from .initial_data import request_user

group = GroupModel.objects.filter(name="test group name", description="test group description").first()
assert group is not None, "Group does not exist"
group.members.filter(id=request_user.id).exists(), "Group did not contain user"