from rest_framework import filters
from rest_framework import mixins
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.invitations.models import Invitation
from foodsaving.invitations.permissions import UserInGroup
from foodsaving.invitations.serializers import InvitationSerializer, InvitationAcceptSerializer


class InvitationsViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    Invitations
    """
    queryset = Invitation.objects
    serializer_class = InvitationSerializer
    filter_backends = (filters.SearchFilter,)
    filter_fields = ('group', )
    permission_classes = (UserInGroup,)

    def get_queryset(self):
        users_groups = self.request.user.groups.values('id')
        return self.queryset.filter(group__in=users_groups)


class InvitationAcceptViewSet(GenericViewSet):
    queryset = Invitation.objects
    serializer_class = InvitationAcceptSerializer
    permission_classes = (IsAuthenticated,)
    lookup_field = 'token'

    @detail_route(methods=['POST'])
    def accept(self, request, **kwargs):
        """
        Accept the invitation
        """
        self.check_object_permissions(request, request.user)
        instance = self.get_object()
        serializer = self.get_serializer(instance, request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


