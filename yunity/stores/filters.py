import django_filters
from rest_framework import filters

from yunity.stores.models import PickupDate


class PickupDatesFilter(filters.FilterSet):
    group = django_filters.NumberFilter(name='store__group__id')
    date = django_filters.DateTimeFromToRangeFilter()

    class Meta:
        model = PickupDate
        fields = ['store', 'group', 'date']
