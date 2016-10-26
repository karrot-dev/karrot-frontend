from config import settings
from yunity.base.base_models import BaseModel, LocationModel
from django.db import models

MAX_STORE_NAME_LENGTH = 80


class PickupDate(BaseModel):
    date = models.DateTimeField()
    collectors = models.ManyToManyField(settings.AUTH_USER_MODEL)
    store = models.ForeignKey('stores.store', related_name='pickupdates', on_delete=models.CASCADE)
    max_collectors = models.IntegerField(null=True)


class Store(BaseModel, LocationModel):
    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=MAX_STORE_NAME_LENGTH)
    description = models.TextField(null=True)
