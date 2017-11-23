from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import filters
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet

from foodsaving.users.serializers import UserSerializer


class UserViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    User Profiles
    """
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter,)
    permission_classes = (IsAuthenticated,)
    search_fields = ('display_name',)

    def retrieve(self, request, *args, **kwargs):
        """Get one user profile"""
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """List all accessible users

        # Query parameters
        - `?search` - search in `display_name`
        """
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        users_groups = self.request.user.groups.values('id')
        return self.queryset.filter(Q(groups__in=users_groups) | Q(id=self.request.user.id)).distinct()
