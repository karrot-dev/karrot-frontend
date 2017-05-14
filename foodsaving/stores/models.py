from itertools import zip_longest

import dateutil.rrule
from dateutil.relativedelta import relativedelta
from django.db import transaction
from django.db.models import Count
from django.dispatch import Signal

from django.utils import timezone

from config import settings
from foodsaving.base.base_models import BaseModel, LocationModel
from django.db import models


class Store(BaseModel, LocationModel):
    class Meta:
        unique_together = ('group', 'name')
    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=settings.NAME_MAX_LENGTH)
    description = models.TextField(blank=True)
    weeks_in_advance = models.PositiveIntegerField(default=4)

    deleted = models.BooleanField(default=False)

    def __str__(self):
        return '{} ({})'.format(self.name, self.group)


class PickupDateSeriesManager(models.Manager):
    @transaction.atomic
    def create_all_pickup_dates(self):
        for series in self.all():
            series.update_pickup_dates()


class PickupDateSeries(BaseModel):
    objects = PickupDateSeriesManager()

    store = models.ForeignKey(
        'stores.store',
        related_name='series',
        on_delete=models.CASCADE
    )
    max_collectors = models.PositiveIntegerField(blank=True, null=True)
    rule = models.TextField()
    start_date = models.DateTimeField()

    @transaction.atomic
    def delete(self, *args, **kwargs):
        self.pickup_dates.filter(date__gte=timezone.now()).\
            annotate(Count('collectors')).\
            filter(collectors__count=0).\
            delete()
        return super().delete(*args, **kwargs)

    def get_dates_for_rule(self, start_date):
        # using local time zone to avoid daylight saving time errors
        tz = self.store.group.timezone
        period_start = start_date.astimezone(tz).replace(tzinfo=None)
        start_date = self.start_date.astimezone(tz).replace(tzinfo=None)
        dates = dateutil.rrule.rrulestr(
            self.rule
        ).replace(
            dtstart=start_date
        ).between(
            period_start,
            period_start + relativedelta(weeks=self.store.weeks_in_advance)
        )
        return [tz.localize(d) for d in dates]

    def update_pickup_dates(self, start=timezone.now):
        # shifting period start time into the future avoids pickup dates which are only valid for a short time
        start_date = start() + relativedelta(minutes=5)
        for pickup, new_date in zip_longest(
            self.pickup_dates.filter(date__gte=start_date),
            self.get_dates_for_rule(start_date=start_date)
        ):
            if not pickup:
                pickup = PickupDate.objects.create(
                    date=new_date,
                    max_collectors=self.max_collectors,
                    series=self,
                    store=self.store
                )
            if not new_date:
                # only delete pickup dates when they are empty
                if pickup.collectors.count() <= 0:
                    pickup.delete()
                    continue
            if new_date and not pickup.is_date_changed:
                pickup.date = new_date
            if not pickup.is_max_collectors_changed:
                pickup.max_collectors = self.max_collectors
            pickup.save()

    def __str__(self):
        return '{} - {}'.format(self.date, self.store)


pickup_done = Signal()


class PickupDateManager(models.Manager):
    @transaction.atomic
    def delete_old_pickup_dates(self):
        for _ in self.filter(date__lt=timezone.now()):
            # move pickup dates into history, also empty ones
            payload = {}
            if _.series:
                payload['series'] = _.series.id
            if _.max_collectors:
                payload['max_collectors'] = _.max_collectors
            pickup_done.send(
                sender=PickupDate.__class__,
                group=_.store.group,
                store=_.store,
                users=_.collectors.all(),
                date=_.date,
                payload=payload
            )
            _.delete()


class PickupDate(BaseModel):
    objects = PickupDateManager()

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

    collectors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='pickup_dates'
    )
    max_collectors = models.PositiveIntegerField(null=True)
    deleted = models.BooleanField(default=False)

    # internal values for change detection
    # used when the respective value in the series gets updated
    is_date_changed = models.BooleanField(default=False)
    is_max_collectors_changed = models.BooleanField(default=False)

    def __str__(self):
        return '{} - {}'.format(self.date, self.store)
