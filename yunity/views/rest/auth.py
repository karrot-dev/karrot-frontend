from django.contrib.auth import authenticate, login
from rest_framework import viewsets, status
from rest_framework import serializers
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from yunity.models import User
import logging

# Get an instance of a logger
logger = logging.getLogger(__name__)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email')

class AuthViewSet(viewsets.ViewSet):
    """
    Login and logout User
    """
    queryset = User.objects.all()

    @detail_route(methods=["POST"])
    def login(self, request):
        """
        Authenticate and login user
        """
        user = authenticate(
            email=request.data.get('email'),
            password=request.data.get('password')
        )

        if user and user.is_active:
            login(request, user)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    @detail_route(methods=["POST"])
    def logout(self):
        """
        Logout user
        """
        return Response(status=status.HTTP_200_OK)
