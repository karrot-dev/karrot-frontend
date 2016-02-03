from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import ForeignKey, CASCADE, PositiveIntegerField, TextField
from django_enumfield import enum

from config import settings
from yunity.base.hub_models import Hub
from yunity.base.base_models import BaseModel
from yunity.groups.models import Group


class PermissionMixin():
    pass


class Permission(BaseModel):
    class Meta:
        abstract = True

    target_content_type = ForeignKey(ContentType, on_delete=CASCADE)
    target_id = PositiveIntegerField()
    target = GenericForeignKey('target_content_type', 'target_id')

    action = TextField()


class ConstantPermissionType(enum.Enum):
    PUBLIC = 0
    REGISTERED_USERS = 1


class ConstantPermission(Permission):
    type = enum.EnumField(ConstantPermissionType)


class GroupTreePermission(Permission):
    group = ForeignKey(Group, on_delete=CASCADE)


class HubPermission(Permission):
    hub = ForeignKey(Hub, on_delete=CASCADE)


class UserPermission(Permission):
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)


class UserConnectionPermission(Permission):
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)