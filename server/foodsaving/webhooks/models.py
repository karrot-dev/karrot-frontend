from dateutil.relativedelta import relativedelta
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.postgres.fields import JSONField
from django.db.models import CharField, TextField, BigAutoField
from django.utils import timezone

from config import settings
from foodsaving.base.base_models import BaseModel


class EmailEventManager(BaseUserManager):

    def ignored_addresses(self):
        return self.filter(
            created_at__gte=timezone.now() - relativedelta(months=6),
            event__in=settings.EMAIL_EVENTS_AVOID
        ).values('address')


class EmailEvent(BaseModel):
    objects = EmailEventManager()

    id = BigAutoField(primary_key=True)
    address = TextField()
    event = CharField(max_length=255)
    payload = JSONField()
