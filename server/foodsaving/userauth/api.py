from anymail.exceptions import AnymailAPIError
from django.contrib.auth import logout, update_session_auth_hash
from django.utils.translation import ugettext as _
from django.middleware.csrf import get_token as generate_csrf_token_for_frontend
from rest_framework import status, generics, views
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from foodsaving.userauth.models import VerificationCode
from foodsaving.userauth.permissions import MailIsNotVerified
from foodsaving.userauth.serializers import AuthLoginSerializer, AuthUserSerializer, \
    ChangePasswordSerializer, RequestResetPasswordSerializer, ChangeMailSerializer, \
    VerificationCodeSerializer, ResetPasswordSerializer


class LogoutView(views.APIView):
    def post(self, request, **kwargs):
        """ Log out """
        logout(request)
        return Response(status=status.HTTP_200_OK, data={})


class AuthView(generics.GenericAPIView):
    serializer_class = AuthLoginSerializer

    def post(self, request, **kwargs):
        """ Log in """
        serializer = AuthLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response(data=AuthUserSerializer(request.user).data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthUserView(generics.GenericAPIView):
    serializer_class = AuthUserSerializer
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        # Allow creating and deleting user when not logged in
        if self.request.method.lower() == 'post' or self.request.method.lower() == 'delete':
            return ()
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.method.lower() == 'delete':
            return VerificationCodeSerializer
        return self.serializer_class

    def post(self, request):
        """Create a new user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request):
        """Update user profile"""
        serializer = self.get_serializer(request.user, request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request):
        """Get logged-in user"""
        generate_csrf_token_for_frontend(request)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def delete(self, request):
        """
        Delete the user account using a previously requested verification code.
        """
        serializer = self.get_serializer(data=request.query_params)
        serializer.context['type'] = VerificationCode.ACCOUNT_DELETE
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})


class RequestDeleteUserView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        """
        Request the deletion of the user account.
        """
        try:
            request.user.send_account_deletion_verification_code()
        except AnymailAPIError:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={_('We could not send you an e-mail.')})
        return Response(status=status.HTTP_204_NO_CONTENT, data={})


class VerifyMailView(generics.GenericAPIView):
    # No need to add the MailIsNotVerified permission because e-mail
    # verification codes only exist for unverified users anyway.
    permission_classes = (AllowAny,)
    serializer_class = VerificationCodeSerializer

    def post(self, request):
        """
        Verify an e-mail address.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.context['type'] = VerificationCode.EMAIL_VERIFICATION
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})


class ResendMailVerificationCodeView(views.APIView):
    permission_classes = (IsAuthenticated, MailIsNotVerified)

    def post(self, request):
        """
        Resend a verification code (via e-mail).
        """
        self.check_object_permissions(request, request.user)
        request.user.send_mail_verification_code()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})


class RequestResetPasswordView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RequestResetPasswordSerializer

    def post(self, request):
        """
        Request a reset of the password.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})


class ResetPasswordView(generics.GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        """
        Reset the password using a previously requested verification token.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.context['type'] = VerificationCode.PASSWORD_RESET
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})


class ChangePasswordView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def put(self, request):
        """
        Change the password.
        """
        self.check_object_permissions(request, request.user)
        serializer = self.get_serializer(request.user, request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Keep the user logged in
        update_session_auth_hash(request, user)

        return Response(status=status.HTTP_204_NO_CONTENT, data={})


class ChangeMailView(generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangeMailSerializer

    def put(self, request):
        """
        Change the e-mail address.
        """
        self.check_object_permissions(request, request.user)
        serializer = self.get_serializer(request.user, request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT, data={})
