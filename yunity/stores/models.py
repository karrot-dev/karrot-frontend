from django.db import models
from config import settings
from yunity.base.base_models import BaseModel


class PickupDate(BaseModel):
    date = models.DateTimeField()
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    store = models.ForeignKey('stores.store', related_name='pickupdates')


class Store(BaseModel):
    group = models.ForeignKey('groups.Group')
    name = models.TextField()
    description = models.TextField()
