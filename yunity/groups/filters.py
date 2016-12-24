import django_filters
from rest_framework import filters

from yunity.groups.models import Group


def include_empty(qs, name, value):
    if value:
        return qs
    return qs.exclude(members=None)


class GroupsFilter(filters.FilterSet):
    include_empty = django_filters.BooleanFilter(name='members', method=include_empty)

    class Meta:
        model = Group
        fields = ['members', 'include_empty']
