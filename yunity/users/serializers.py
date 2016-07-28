from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'first_name', 'last_name', 'email', 'password',
                  'address', 'latitude', 'longitude']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(
            **{x: validated_data.get(x, None) for x in self.get_fields() if x is not 'id'})
