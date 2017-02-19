from django.dispatch import Signal
from rest_framework import filters
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from foodsaving.base.permissions import DenyAll
from foodsaving.groups.filters import GroupsFilter
from foodsaving.groups.serializers import GroupDetailSerializer, GroupPreviewSerializer
from foodsaving.groups.models import Group as GroupModel


post_group_join = Signal()
post_group_leave = Signal()


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
    - `?include_empty` - set to False to exclude empty groups without members
    """
    queryset = GroupModel.objects.all()
    serializer_class = GroupDetailSerializer
    preview_serializer_class = GroupPreviewSerializer
    filter_backends = (filters.SearchFilter, filters.DjangoFilterBackend)
    filter_class = GroupsFilter
    search_fields = ('name', 'description')

    def get_serializer_class(self):
        use_preview_serializer = True

        if self.action == 'create':
            use_preview_serializer = False

        if self.action in ('retrieve', 'update', 'partial_update'):
            try:
                if self.request.user in self.get_object().members.all():
                    use_preview_serializer = False
            except AssertionError:
                # Swagger (using OpenAPI) does not give a pk, therefore
                # we can't determine if it's legit to return the Detail serializer
                pass

        if use_preview_serializer:
            return GroupPreviewSerializer
        return GroupDetailSerializer

    def get_permissions(self):
        if self.action == 'destroy':
            self.permission_classes = (DenyAll,)
        elif self.action in ('update', 'partial_update'):
            self.permission_classes = (IsMember,)
        else:
            self.permission_classes = (IsAuthenticatedOrReadOnly,)

        return super().get_permissions()

    @detail_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated,)
    )
    def join(self, request, pk=None):
        group = self.get_object()
        if group.password != '':
            if 'password' not in request.data:
                return Response(data='no group password given', status=status.HTTP_403_FORBIDDEN)
            if group.password != request.data['password']:
                return Response(data='group password wrong', status=status.HTTP_403_FORBIDDEN)

        group.members.add(request.user)
        post_group_join.send(sender=self.__class__, group=group, user=request.user)
        return Response(status=status.HTTP_200_OK)

    @detail_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated,)
    )
    def leave(self, request, pk=None):
        group = self.get_object()
        if not group.members.filter(id=request.user.id).exists():
            return Response("User not member of group",
                            status=status.HTTP_400_BAD_REQUEST)
        group.members.remove(request.user)
        post_group_leave.send(sender=self.__class__, group=group, user=request.user)
        return Response(status=status.HTTP_200_OK)
