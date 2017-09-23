from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils import timezone
from rest_framework import filters
from rest_framework import mixins
from rest_framework import status
from rest_framework.decorators import list_route
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.users.permissions import IsSameUser, IsNotVerified
from foodsaving.users.serializers import UserSerializer, VerifyMailSerializer
from foodsaving.utils.mixins import PartialUpdateModelMixin


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    PartialUpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    """
    Users

    # Query parameters
    - `?search` - search in `display_name`
    """
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter,)
    permission_classes = (IsSameUser,)
    search_fields = ('display_name',)

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = (AllowAny,)
        elif self.action in ('list', 'retrieve'):
            self.permission_classes = (IsAuthenticated,)

        return super().get_permissions()

    def get_queryset(self):
        users_groups = self.request.user.groups.values('id')
        return self.queryset.filter(Q(groups__in=users_groups) | Q(id=self.request.user.id)).distinct()

    def perform_destroy(self, user):
        """
        To keep historic pickup infos, don't delete this user, but remove its details from the database.
        """

        from foodsaving.groups.models import Group
        from foodsaving.groups.models import GroupMembership
        from foodsaving.stores.models import PickupDate

        for _ in Group.objects.filter(members__in=[user, ]):
            GroupMembership.objects.filter(group=_, user=user).delete()

        for _ in PickupDate.objects. \
                filter(date__gte=timezone.now()). \
                filter(collectors__in=[user, ]):
            _.collectors.remove(user)

        user.description = ''
        user.set_unusable_password()
        user.mail = None
        user.is_active = False
        user.is_staff = False
        user.activation_key = ''
        user.key_expires_at = None
        user.mail_verified = False
        user.unverified_email = None
        user.deleted_at = timezone.now()
        user.deleted = True
        user.save()

    @list_route(
        methods=['POST'],
        permission_classes=(IsNotVerified, IsAuthenticated),
        serializer_class=VerifyMailSerializer
    )
    def verify_mail(self, request, pk=None):
        """
        requires "key" parameter
        """
        self.check_object_permissions(request, request.user)
        serializer = self.get_serializer(request.user, request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(status=status.HTTP_204_NO_CONTENT, data={})

    @list_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated,)
    )
    def resend_verification(self, request, pk=None):
        "resend verification mail"
        if request.user.mail_verified:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'error': 'Already verified'})
        request.user.send_new_verification_code()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})

    @list_route(
        methods=['POST']
    )
    def reset_password(self, request, pk=None):
        """
        send a request with 'email' to this endpoint to get a new password mailed
        """
        request_email = request.data.get('email')
        if not request_email:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'error': 'mail address is not provided'})
        try:
            user = get_user_model().objects.get(email__iexact=request_email)
        except get_user_model().DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user.reset_password()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})
