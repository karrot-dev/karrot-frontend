import dateutil.rrule
from dateutil.relativedelta import relativedelta

from django.utils import timezone

from config import settings
from yunity.base.base_models import BaseModel, LocationModel
from django.db import models


class Store(BaseModel, LocationModel):
    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=settings.NAME_MAX_LENGTH)
    description = models.TextField(blank=True)
    weeks_in_advance = models.PositiveIntegerField(default=4)


class PickupDateSeriesManager(models.Manager):
    def create_all_pickup_dates(self):
        for series in self.all():
            series.create_pickup_dates()


class PickupDateSeries(BaseModel):
    objects = PickupDateSeriesManager()

    store = models.ForeignKey(
        'stores.store',
        related_name='series',
        on_delete=models.CASCADE
    )
    max_collectors = models.IntegerField(blank=True, null=True)
    rule = models.TextField()
    start_date = models.DateTimeField()

    def delete(self, *args, **kwargs):
        self.pickup_dates.filter(date__gte=timezone.now()).delete()
        return super().delete(*args, **kwargs)

    def create_pickup_dates(self, start=timezone.now):
        # using local time zone to avoid daylight saving time errors
        tz = self.store.group.timezone
        period_start = start().astimezone(tz).replace(tzinfo=None)
        start_date = self.start_date.astimezone(tz).replace(tzinfo=None)
        dates = dateutil.rrule.rrulestr(
            self.rule
        ).replace(
            dtstart=start_date
        ).between(
            period_start,
            period_start + relativedelta(weeks=self.store.weeks_in_advance)
        )
        dates = [tz.localize(d) for d in dates]

        pickup_dates = PickupDate.objects.filter(series=self)
        for _ in dates:
            if pickup_dates.filter(date=_).exists():
                continue
            PickupDate.objects.create(
                date=_,
                max_collectors=self.max_collectors,
                series=self,
                store=self.store
            )


class PickupDate(BaseModel):
    class Meta:
        ordering = ['date']

    series = models.ForeignKey(
        'stores.PickupDateSeries',
        related_name='pickup_dates',
        on_delete=models.SET_NULL,
        null=True
    )
    store = models.ForeignKey(
        'stores.store',
        related_name='pickup_dates',
        on_delete=models.CASCADE
    )
    date = models.DateTimeField()
    collectors = models.ManyToManyField(settings.AUTH_USER_MODEL)
    max_collectors = models.IntegerField(null=True)
    deleted = models.BooleanField(default=False)
