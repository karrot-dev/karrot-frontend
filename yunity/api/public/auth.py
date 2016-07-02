from django.contrib.auth import logout
from django.middleware.csrf import get_token as generate_csrf_token_for_frontend
from rest_framework import status, viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from yunity.api.serializers import AuthLoginSerializer
from yunity.users.serializers import UserSerializer


class AuthViewSet(viewsets.GenericViewSet):
    serializer_class = AuthLoginSerializer

    @list_route(methods=['get'])
    def status(self, request):
        """ Get the login state (logged in user)
        ---
        response_serializer: UserSerializer
        """
        generate_csrf_token_for_frontend(request)
        if request.user.is_anonymous():
            serializer = UserSerializer()
        else:
            serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def create(self, request, **kwargs):
        """ Log in
        ---
        request_serializer: AuthLoginSerializer
        response_serializer: UserSerializer
        """
        serializer = AuthLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            return Response(data=UserSerializer(request.user).data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=['POST'])
    def logout(self, request, **kwargs):
        logout(request)
        return Response(status=status.HTTP_200_OK)
