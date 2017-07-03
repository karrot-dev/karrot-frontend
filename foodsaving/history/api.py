from rest_framework import viewsets
from rest_framework.filters import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated

from foodsaving.history.filters import HistoryFilter
from foodsaving.history.models import History
from foodsaving.history.serializers import HistorySerializer


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
