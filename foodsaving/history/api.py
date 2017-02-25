from django_filters.rest_framework import filters
from django_filters.rest_framework import FilterSet
from rest_framework import viewsets
from rest_framework.filters import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated

from foodsaving.history.models import History, HistoryTypus
from foodsaving.history.serializers import HistorySerializer


def filter_history_typus(qs, field, value):
    return qs.filter(**{field: getattr(HistoryTypus, value)})


class HistoryFilter(FilterSet):
    class Meta:
        model = History
        fields = ('group', 'store', 'users', 'typus')
    typus = filters.ChoiceFilter(choices=HistoryTypus.items(), method=filter_history_typus)


class HistoryPagination(LimitOffsetPagination):
    default_limit = 50
    max_limit = 1000


class HistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    History of user actions
    """
    serializer_class = HistorySerializer
    queryset = History.objects
    filter_backends = (DjangoFilterBackend,)
    filter_class = HistoryFilter
    permission_classes = (IsAuthenticated,)
    pagination_class = HistoryPagination

    def get_queryset(self):
        return self.queryset.filter(group__members=self.request.user)
