from itertools import zip_longest

import dateutil.rrule
import requests
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db import transaction
from django.db.models import Count
from django.template.loader import render_to_string
from django.utils import timezone

from foodsaving.base.base_models import BaseModel
from foodsaving.history.models import History, HistoryTypus
from django.core.validators import MinValueValidator, MaxValueValidator


class PickupDateSeriesManager(models.Manager):
    @transaction.atomic
    def create_all_pickup_dates(self):
        for series in self.all():
            series.update_pickup_dates()


class PickupDateSeries(BaseModel):
    objects = PickupDateSeriesManager()

    store = models.ForeignKey(
        'stores.Store',
        related_name='series',
        on_delete=models.CASCADE
    )
    max_collectors = models.PositiveIntegerField(blank=True, null=True)
    rule = models.TextField()
    start_date = models.DateTimeField()
    description = models.TextField(blank=True)

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
        """
        synchronizes the pickup dates with the series

        changes to the series fields are also made to the pickup dates, except for
        - the field on the pickup date has been modified
        - users have joined the pickup date
        """

        # shift start time slightly into future to avoid pickup dates which are only valid for very short time
        start_date = start() + relativedelta(minutes=5)

        for pickup, new_date in zip_longest(
            self.pickup_dates.filter(date__gte=start_date),
            self.get_dates_for_rule(start_date=start_date)
        ):
            if not pickup:
                # does not yet exist
                PickupDate.objects.create(
                    date=new_date,
                    max_collectors=self.max_collectors,
                    series=self,
                    store=self.store,
                    description=self.description
                )
            elif pickup.collectors.count() < 1:
                # only modify pickups when nobody has joined
                if not new_date:
                    # series changed and now this pickup should not exist anymore
                    pickup.delete()
                else:
                    if not pickup.is_date_changed:
                        pickup.date = new_date
                    if not pickup.is_max_collectors_changed:
                        pickup.max_collectors = self.max_collectors
                    if not pickup.is_description_changed:
                        pickup.description = self.description
                    pickup.save()

    def __str__(self):
        return '{} - {}'.format(self.date, self.store)


class PickupDateManager(models.Manager):
    @transaction.atomic
    def process_finished_pickup_dates(self):
        """find all pickup dates that are in the past and didn't get processed yet

        if they have at least one collector: send out the pickup_done signal
        else send out pickup_missed

        currently only used by the history component
        """
        for _ in self.filter(
                done_and_processed=False,
                date__lt=timezone.now(),
                deleted=False,
        ):
            payload = {}
            payload['pickup_date'] = _.id
            if _.series:
                payload['series'] = _.series.id
            if _.max_collectors:
                payload['max_collectors'] = _.max_collectors
            if _.collectors.count() == 0:
                History.objects.create(
                    typus=HistoryTypus.PICKUP_MISSED,
                    group=_.store.group,
                    store=_.store,
                    date=_.date,
                    payload=payload,
                )
            else:
                History.objects.create(
                    typus=HistoryTypus.PICKUP_DONE,
                    group=_.store.group,
                    store=_.store,
                    users=_.collectors.all(),
                    date=_.date,
                    payload=payload,
                )
            _.done_and_processed = True
            _.save()


class PickupDate(BaseModel):
    objects = PickupDateManager()

    class Meta:
        ordering = ['date']

    series = models.ForeignKey(
        'PickupDateSeries',
        related_name='pickup_dates',
        on_delete=models.SET_NULL,
        null=True
    )
    store = models.ForeignKey(
        'stores.Store',
        related_name='pickup_dates',
        on_delete=models.CASCADE
    )
    date = models.DateTimeField()

    collectors = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='pickup_dates'
    )
    description = models.TextField(blank=True)
    max_collectors = models.PositiveIntegerField(null=True)
    deleted = models.BooleanField(default=False)

    # internal values for change detection
    # used when the respective value in the series gets updated
    is_date_changed = models.BooleanField(default=False)
    is_max_collectors_changed = models.BooleanField(default=False)
    is_description_changed = models.BooleanField(default=False)

    # internal value to find out if this has been processed
    # e.g. logged to history as PICKUP_DONE or PICKUP_MISSED
    done_and_processed = models.BooleanField(default=False)

    notifications_sent = JSONField(default=dict)

    def __str__(self):
        return '{} - {}'.format(self.date, self.store)

    def notify_upcoming_via_slack(self):
        if 'upcoming' not in self.notifications_sent:
            store_page_url = '{hostname}/#/group/{groupid}/store/{storeid}'\
                .format(hostname=settings.HOSTNAME,
                        groupid=self.store.group.id,
                        storeid=self.store.id)
            r = requests.post(self.store.group.slack_webhook, json={
                'username': self.store.group.name,
                'icon_url': '{hostname}/statics/carrot_logo.png'.format(hostname=settings.HOSTNAME),  # TODO fix path
                'attachments': [
                    {
                        'title': self.store.name,
                        'title_link': store_page_url,
                        'text': render_to_string('upcoming_pickup_slack.jinja', {
                            'number_of_hours': self.store.upcoming_notification_hours,
                            'store_page_url': store_page_url
                        }),
                        'color': 'warning'
                    }
                ]
            })
            self.notifications_sent['upcoming'] = {'status': r.status_code, 'data': r.text}
            self.save()

    def is_upcoming(self):
        return self.date > timezone.now()

    def is_full(self):
        if not self.max_collectors:
            return False
        return self.collectors.count() >= self.max_collectors

    def is_collector(self, user):
        return self.collectors.filter(id=user.id).exists()

    def is_empty(self):
        return self.collectors.count() == 0

    def is_recent(self):
        return self.date >= timezone.now() - relativedelta(days=30)


class Feedback(BaseModel):
    given_by = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='feedback')
    about = models.ForeignKey('PickupDate', on_delete=models.CASCADE)
    weight = models.FloatField(
        blank=True, null=True, validators=[MinValueValidator(-0.01), MaxValueValidator(10000.0)])
    comment = models.CharField(max_length=settings.DESCRIPTION_MAX_LENGTH, blank=True)

    class Meta:
        unique_together = ('about', 'given_by')
