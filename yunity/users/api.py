from django.contrib.auth import get_user_model
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission

from yunity.users.serializers import UserSerializer


class IsSameUser(BasePermission):
    message = 'You can modify only your own user data.'

    def has_object_permission(self, request, view, obj):
        return request.user == obj


class UserViewSet(viewsets.ModelViewSet):
    """
    Users

    # Query parameters
    - `?search` - search in `display_name`
    """
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('display_name',)

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = (AllowAny,)
        elif self.action in ('list', 'retrieve'):
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (IsSameUser,)

        return super().get_permissions()

    def get_queryset(self):
        users_groups = self.request.user.groups.values('id')
        return self.queryset.filter(groups__in=users_groups)
