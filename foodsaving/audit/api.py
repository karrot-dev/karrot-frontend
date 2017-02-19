from rest_framework import viewsets
from rest_framework.filters import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated

from foodsaving.audit.models import Audit
from foodsaving.audit.serializers import AuditSerializer


class AuditViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Audit
    """
    serializer_class = AuditSerializer
    queryset = Audit.objects
    filter_fields = ('group', 'store', 'users')
    filter_backends = (DjangoFilterBackend,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.queryset.filter(group__members=self.request.user)
