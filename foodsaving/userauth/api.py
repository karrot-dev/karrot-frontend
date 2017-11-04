from django.contrib.auth import logout
from django.middleware.csrf import get_token as generate_csrf_token_for_frontend
from django.utils import timezone
from rest_framework import status, generics
from rest_framework.decorators import list_route
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from foodsaving.userauth.serializers import AuthLoginSerializer, AuthUserSerializer


class AuthViewSet(GenericViewSet):
    serializer_class = AuthLoginSerializer

    @list_route(methods=['get'])
    def status(self, request):
        """ Get the login state (logged in user)
        DEPRECATED in favour of /auth/user/
        ---
        response_serializer: UserSerializer
        """
        generate_csrf_token_for_frontend(request)
        if request.user.is_anonymous():
            return Response(data={"error": "not_authed"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            serializer = AuthUserSerializer(request.user)
            return Response(serializer.data)

    def create(self, request, **kwargs):
        """ Log in
        ---
        request_serializer: AuthLoginSerializer
        response_serializer: UserSerializer
        """
        serializer = AuthLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response(data=AuthUserSerializer(request.user).data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['POST'])
    def logout(self, request, **kwargs):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class AuthUserView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AuthUserSerializer

    def get_permissions(self):
        # Allow creating user when not logged in
        if self.request.method.lower() == 'post':
            return (AllowAny, )
        return super().get_permissions()

    def post(self, request):
        """Create a new user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        """Update user profile"""
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        """Get logged-in user"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def delete(self, request):
        """
        Deletes the user from the database
        
        To keep historic pickup infos, don't delete this user, but remove its details from the database.
        """
        user = request.user
        from foodsaving.groups.models import Group
        from foodsaving.groups.models import GroupMembership

        # Emits pre_delete and post_delete signals, they are used to remove the user from pick-ups
        for _ in Group.objects.filter(members__in=[user, ]):
            GroupMembership.objects.filter(group=_, user=user).delete()

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

        return Response(status=status.HTTP_204_NO_CONTENT)
