from django import forms
from django.utils.dateparse import parse_datetime
from django.utils.encoding import force_str
from django_filters.fields import RangeField
from django_filters.rest_framework import FilterSet, RangeFilter, NumberFilter

from foodsaving.pickups.models import PickupDate, PickupDateSeries, Feedback


class ISODateTimeField(forms.DateTimeField):
    def strptime(self, value, format):
        return parse_datetime(force_str(value))


class DateTimeRangeField(RangeField):
    def __init__(self, *args, **kwargs):
        fields = (
            ISODateTimeField(),
            ISODateTimeField())
        super(DateTimeRangeField, self).__init__(fields, *args, **kwargs)


class DateTimeFromToRangeFilter(RangeFilter):
    field_class = DateTimeRangeField


class PickupDateSeriesFilter(FilterSet):
    class Meta:
        model = PickupDateSeries
        fields = ['store', ]


class PickupDatesFilter(FilterSet):
    store = NumberFilter(field_name='store')
    group = NumberFilter(field_name='store__group__id')
    date = DateTimeFromToRangeFilter(field_name='date')

    class Meta:
        model = PickupDate
        fields = ['store', 'group', 'date', 'series']


class FeedbackFilter(FilterSet):
    store = NumberFilter(field_name='about__store__id')
    about = NumberFilter(field_name='about')
    given_by = NumberFilter(field_name='given_by')

    class Meta:
        model = Feedback
        fields = ['store', 'about', 'given_by']
