from config import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import ForeignKey, CASCADE, PositiveIntegerField, TextField
from yunity.base.hub_models import Hub
from yunity.base.models import BaseModel


class PermissionMixin():
    pass



class Permission(BaseModel):
    class Meta:
        abstract = True

    target_content_type = ForeignKey(ContentType, on_delete=CASCADE)
    target_id = PositiveIntegerField()
    target = GenericForeignKey('target_content_type', 'target_id')

    action = TextField()


class HubPermission(Permission):
    hub = ForeignKey(Hub, on_delete=CASCADE)


class UserPermission(Permission):
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)
