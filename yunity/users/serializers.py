from django.contrib.auth import get_user_model
from rest_framework import serializers

from config import settings


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'email', 'password',
                  'address', 'latitude', 'longitude', 'description']
        extra_kwargs = {'password': {'write_only': True},
                        'description': {'trim_whitespace': False,
                                        'max_length': settings.DESCRIPTION_MAX_LENGTH}}

    def validate(self, data):
        if 'description' not in data:
            data['description'] = ''
        return data

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(
            **{x: validated_data.get(x, None) for x in self.get_fields() if x is not 'id'})
