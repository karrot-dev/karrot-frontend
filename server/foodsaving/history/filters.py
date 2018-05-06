from django import forms
from django.utils.dateparse import parse_datetime
from django.utils.encoding import force_str
from django_filters.fields import RangeField
from django_filters.rest_framework import filters, FilterSet, RangeFilter

from foodsaving.history.models import HistoryTypus, History


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


def filter_history_typus(qs, field, value):
    return qs.filter(**{field: getattr(HistoryTypus, value)})


class HistoryFilter(FilterSet):
    typus = filters.ChoiceFilter(choices=HistoryTypus.items(), method=filter_history_typus)
    date = DateTimeFromToRangeFilter(field_name='date')

    class Meta:
        model = History
        fields = ('group', 'store', 'users', 'typus', 'date')

