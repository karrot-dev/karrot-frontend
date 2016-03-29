from django.contrib.auth import get_user_model
from rest_framework import viewsets, serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**{x: validated_data[x] for x in self.get_fields() if x is not 'id'})


class UsersViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
