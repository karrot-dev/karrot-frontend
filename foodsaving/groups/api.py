import pytz
from django.utils.translation import ugettext_lazy as _
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.decorators import detail_route, list_route
from rest_framework.filters import SearchFilter
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, BasePermission
from rest_framework.response import Response
from rest_framework.schemas.generators import is_custom_action
from rest_framework.viewsets import GenericViewSet

from foodsaving.conversations.api import RetrieveConversationMixin
from foodsaving.groups import roles
from foodsaving.groups.filters import GroupsFilter
from foodsaving.groups.models import Group as GroupModel, GroupMembership
from foodsaving.groups.serializers import GroupDetailSerializer, GroupPreviewSerializer, GroupJoinSerializer, \
    GroupLeaveSerializer, TimezonesSerializer, EmptySerializer, \
    GroupMembershipAddRoleSerializer, GroupMembershipRemoveRoleSerializer, GroupMembershipInfoSerializer
from foodsaving.utils.mixins import PartialUpdateModelMixin


class IsMember(BasePermission):
    message = _('You are not a member of this group.')

    def has_object_permission(self, request, view, obj):
        return obj.is_member(request.user)


class IsNotMember(BasePermission):
    message = _('You are already a member.')

    def has_object_permission(self, request, view, obj):
        return not obj.is_member(request.user)


class CanUpdateMemberships(BasePermission):
    message = _('You do not have permission to update memberships.')

    def has_object_permission(self, request, view, obj):
        # we get a membership object
        return obj.group.is_member_with_role(request.user, roles.GROUP_MEMBERSHIP_MANAGER)


class GroupViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    PartialUpdateModelMixin,
    mixins.ListModelMixin,
    RetrieveConversationMixin,
    GenericViewSet
):
    """
    Groups

    # Query parameters
    - `?members` - filter by member user id
    - `?search` - search in name and public description
    - `?include_empty` - set to False to exclude empty groups without members
    """
    queryset = GroupModel.objects
    filter_backends = (SearchFilter, DjangoFilterBackend)
    filter_class = GroupsFilter
    search_fields = ('name', 'public_description')

    def get_serializer_class(self):
        if self.action == 'create':
            self.serializer_class = GroupDetailSerializer
        elif self.action in ('retrieve', 'update', 'partial_update'):
            self.serializer_class = GroupPreviewSerializer
            try:
                if self.request.user in self.get_object().members.all():
                    self.serializer_class = GroupDetailSerializer
            except AssertionError:
                # Swagger (using OpenAPI) does not give a pk, therefore
                # we can't determine if it's legit to return the Detail serializer
                pass
        elif is_custom_action(self.action):
            pass
        else:
            self.serializer_class = GroupPreviewSerializer
        return self.serializer_class

    def get_permissions(self):
        if self.action in ('update', 'partial_update'):
            self.permission_classes = (IsMember,)
        elif is_custom_action(self.action):
            pass
        else:
            self.permission_classes = (IsAuthenticatedOrReadOnly,)

        return super().get_permissions()

    @detail_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated, IsNotMember),
        serializer_class=GroupJoinSerializer
    )
    def join(self, request, pk=None):
        return self.partial_update(request)

    @detail_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated, IsMember),
        serializer_class=GroupLeaveSerializer
    )
    def leave(self, request, pk=None):
        return self.partial_update(request)

    @list_route(
        methods=['GET'],
        serializer_class=TimezonesSerializer
    )
    def timezones(self, request, pk=None):
        """ lists all accepted timezones """
        return Response(self.get_serializer(
            {'all_timezones': pytz.all_timezones}
        ).data)

    @detail_route(
        permission_classes=(IsAuthenticated, IsMember)
    )
    def conversation(self, request, pk=None):
        return self.retrieve_conversation(request, pk)

    @detail_route(
        methods=['PUT', 'DELETE'],
        permission_classes=(IsAuthenticated, CanUpdateMemberships),
        url_name='user-roles',
        url_path='users/(?P<user_id>[^/.]+)/roles/(?P<role_name>[^/.]+)',
        serializer_class=EmptySerializer  # for Swagger
    )
    def modify_user_roles(self, request, pk, user_id, role_name):
        """add (POST) or remove (DELETE) a membership role"""
        instance = get_object_or_404(GroupMembership.objects, group=pk, user=user_id)
        self.check_object_permissions(request, instance)
        serializer_class = None
        if request.method == 'PUT':
            serializer_class = GroupMembershipAddRoleSerializer
        elif request.method == 'DELETE':
            serializer_class = GroupMembershipRemoveRoleSerializer
        serializer = serializer_class(instance, data={'role_name': role_name}, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(GroupMembershipInfoSerializer(instance).data)
