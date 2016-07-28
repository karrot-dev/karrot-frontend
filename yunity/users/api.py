from django.contrib.auth import get_user_model
from rest_framework import filters
from rest_framework import viewsets
from yunity.users.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('display_name', 'first_name', 'last_name')
