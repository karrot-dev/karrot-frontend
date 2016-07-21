from config import settings
from yunity.base.base_models import BaseModel
from django.db import models


class PickupDate(BaseModel):
    date = models.DateTimeField()
    collectors = models.ManyToManyField(settings.AUTH_USER_MODEL)
    store = models.ForeignKey('stores.store', related_name='pickupdates', on_delete=models.CASCADE)
    max_collectors = models.IntegerField(null=True)


class Store(BaseModel):
    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE)
    name = models.TextField()
    description = models.TextField(null=True)
