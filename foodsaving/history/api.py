from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import IsAuthenticated

from foodsaving.groups.models import GroupMembership
from foodsaving.groups.roles import GROUP_APPROVED_MEMBER
from foodsaving.history.filters import HistoryFilter
from foodsaving.history.models import History
from foodsaving.history.serializers import HistorySerializer


class HistoryPagination(CursorPagination):
    # TODO: create an index on 'date' for increased speed
    page_size = 10
    ordering = '-date'


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
        return self.queryset.filter(
            group__in=GroupMembership.objects.filter(
                user=self.request.user,
                roles__contains=[GROUP_APPROVED_MEMBER]
            ).values_list('group', flat=True)
        )
