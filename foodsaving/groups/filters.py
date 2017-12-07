from django_filters.rest_framework import FilterSet, BooleanFilter

from foodsaving.groups.models import Group


def include_empty(qs, name, value):
    if value:
        return qs
    return qs.exclude(members=None)


class GroupsInfoFilter(FilterSet):
    include_empty = BooleanFilter(field_name='members', method=include_empty)

    class Meta:
        model = Group
        fields = ['members', 'include_empty', 'name']


class GroupsFilter(FilterSet):
    class Meta:
        model = Group
        fields = ['members', 'name']
