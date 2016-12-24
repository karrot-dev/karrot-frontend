from django.contrib.auth import get_user_model
from rest_framework import filters
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework.response import Response

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


    @detail_route(methods=['GET'],
                  permission_classes=(IsAuthenticated,))
    def verify_mail(self, request, pk=None):
        try:
            user = get_user_model().objects.get(id=pk)
        except:
            Response(status=status.HTTP_400_BAD_REQUEST)

        if user.mail_verified:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data="Already verified")

        if request.query_params['key'] != user.activation_key:
            # TODO check for expiry
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data="Wrong key")
        user.mail_verified = True
        user.save()
        return Response(status=status.HTTP_200_OK)

    @detail_route(methods=['GET'],
                  permission_classes=(IsAuthenticated,))
    def resend_verification(self, request, pk=None):
        try:
            user = get_user_model().objects.get(id=pk)
        except:
            Response(status=status.HTTP_400_BAD_REQUEST)
        if user.mail_verified:
            return Response(status=status.HTTP_400_BAD_REQUEST,
                            data="Already verified")
        UserSerializer._send_verification_code(user)
        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):
        users_groups = self.request.user.groups.values('id')
        return self.queryset.filter(groups__in=users_groups).distinct()
