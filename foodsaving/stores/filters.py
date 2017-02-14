import django_filters
from django import forms
from django.utils.dateparse import parse_datetime
from django.utils.encoding import force_str
from django_filters.fields import RangeField
from rest_framework import filters

from foodsaving.stores.models import PickupDate, PickupDateSeries


class ISODateTimeField(forms.DateTimeField):
    def strptime(self, value, format):
        return parse_datetime(force_str(value))


class DateTimeRangeField(RangeField):
    def __init__(self, *args, **kwargs):
        fields = (
            ISODateTimeField(),
            ISODateTimeField())
        super(DateTimeRangeField, self).__init__(fields, *args, **kwargs)


class DateTimeFromToRangeFilter(django_filters.RangeFilter):
    field_class = DateTimeRangeField


class PickupDateSeriesFilter(filters.FilterSet):
    class Meta:
        model = PickupDateSeries
        fields = ['store', ]


class PickupDatesFilter(filters.FilterSet):
    store = django_filters.NumberFilter(name='store')
    group = django_filters.NumberFilter(name='store__group__id')
    date = DateTimeFromToRangeFilter(name='date')

    class Meta:
        model = PickupDate
        fields = ['store', 'group', 'date', 'series']
