from django import forms
from django.utils.dateparse import parse_datetime
from django.utils.encoding import force_str
from django_filters.fields import RangeField
from django_filters.rest_framework import FilterSet, RangeFilter, NumberFilter, BooleanFilter

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
    feedback_possible = BooleanFilter(method='filter_feedback_possible')

    class Meta:
        model = PickupDate
        fields = ['store', 'group', 'date', 'series', 'feedback_possible']

    def filter_feedback_possible(self, qs, name, value):
        q = self.Meta.model.objects.feedback_possible_q(self.request.user)
        if value is True:
            return qs.filter(q)
        return qs.filter(~q)


class FeedbackFilter(FilterSet):
    group = NumberFilter(field_name='about__store__group__id')
    store = NumberFilter(field_name='about__store__id')
    about = NumberFilter(field_name='about')
    given_by = NumberFilter(field_name='given_by')
    created_at = DateTimeFromToRangeFilter(field_name='created_at')

    class Meta:
        model = Feedback
        fields = ['group', 'store', 'about', 'given_by', 'created_at']
