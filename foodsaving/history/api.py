from rest_framework import viewsets
from rest_framework.filters import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from foodsaving.history.models import History
from foodsaving.history.serializers import HistorySerializer


class HistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    History of user actions
    """
    serializer_class = HistorySerializer
    queryset = History.objects
    filter_fields = ('group', 'store', 'users')
    filter_backends = (DjangoFilterBackend,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(group__members=self.request.user)
