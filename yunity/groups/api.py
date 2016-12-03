from rest_framework import filters
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from yunity.base.permissions import DenyAll
from yunity.groups.serializers import GroupSerializer
from yunity.groups.models import Group as GroupModel


class IsMember(BasePermission):
    message = 'You are not a member.'

    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()


class GroupViewSet(ModelViewSet):
    """
    Groups

    # Query parameters
    - `?members` - filter by member user id
    - `?search` - search in name and description
    """
    queryset = GroupModel.objects.all()
    serializer_class = GroupSerializer
    filter_fields = ('members',)
    filter_backends = (filters.SearchFilter, filters.DjangoFilterBackend)
    search_fields = ('name', 'description')

    def get_permissions(self):
        if self.action == 'destroy':
            self.permission_classes = (DenyAll,)
        elif self.action in ('update', 'partial_update'):
            self.permission_classes = (IsMember,)
        else:
            self.permission_classes = (IsAuthenticatedOrReadOnly,)

        return super().get_permissions()

    @detail_route(methods=['POST', 'GET'],
                  permission_classes=(IsAuthenticated,))
    def join(self, request, pk=None):
        group = self.get_object()
        group.members.add(request.user)
        return Response(status=status.HTTP_200_OK)

    @detail_route(methods=['POST', 'GET'],
                  permission_classes=(IsAuthenticated,))
    def leave(self, request, pk=None):
        group = self.get_object()
        if not group.members.filter(id=request.user.id).exists():
            return Response("User not member of group",
                            status=status.HTTP_400_BAD_REQUEST)
        group.members.remove(request.user)
        return Response(status=status.HTTP_200_OK)
