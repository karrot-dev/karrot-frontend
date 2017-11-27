from django.conf import settings
from django.db import models

from foodsaving.base.base_models import BaseModel, LocationModel


class Store(BaseModel, LocationModel):
    class Meta:
        unique_together = ('group', 'name')

    DEFAULT_STATUS = 'created'
    STATUSES = (DEFAULT_STATUS, 'negotiating', 'active', 'declined', 'archived')

    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=settings.NAME_MAX_LENGTH)
    description = models.TextField(blank=True)
    weeks_in_advance = models.PositiveIntegerField(default=4)
    upcoming_notification_hours = models.PositiveIntegerField(default=4)
    status = models.CharField(max_length=20, default=DEFAULT_STATUS)

    deleted = models.BooleanField(default=False)

    def __str__(self):
        return '{} ({})'.format(self.name, self.group)
