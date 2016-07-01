from django.db import models
from config import settings
from yunity.base.base_models import BaseModel


class PickupDate(BaseModel):
    date = models.DateTimeField()
    collectors = models.ManyToManyField(settings.AUTH_USER_MODEL)
    store = models.ForeignKey('stores.store', related_name='pickupdates')
    max_collectors = models.IntegerField(null=True)


class Store(BaseModel):
    group = models.ForeignKey('groups.Group')
    name = models.TextField()
    description = models.TextField(null=True)
