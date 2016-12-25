from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.response import Response

from yunity.users.serializers import UserSerializer, VerifyMailSerializer


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

    @list_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated,)
    )
    def verify_mail(self, request, pk=None):
        """
        requires "key" parameter
        """
        if request.user.mail_verified:
            return Response(data={'error': 'mail is already verified'},
                            status=status.HTTP_400_BAD_REQUEST)
        s = VerifyMailSerializer(request.user, request.data)
        if s.is_valid():
            s.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(data=s.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @list_route(
        methods=['POST'],
        permission_classes=(IsAuthenticated,)
    )
    def resend_verification(self, request, pk=None):
        "resend verification mail"
        if request.user.mail_verified:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'error': 'Already verified'})
        request.user.send_verification_code()
        return Response(status=status.HTTP_200_OK)

    @list_route(
        methods=['POST']
    )
    def reset_password(self, request, pk=None):
        """
        send a request with 'email' to this endpoint to get a new password mailed

        to prevent information leaks, also returns success if the mail doesn't exist
        """
        request_email = request.data.get('email')
        if not request_email:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'error': 'mail address is not provided'})
        try:
            user = get_user_model().objects.get(email=request_email)
        except get_user_model().DoesNotExist:
            # don't leak valid mail addresses
            return Response(status=status.HTTP_204_NO_CONTENT)
        if not user.mail_verified:
            # I think we can leave this in here, unverified addresses are not so useful to spammers
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data={'error': 'mail is not verified'})
        user.reset_password()
        return Response(status=status.HTTP_204_NO_CONTENT)
