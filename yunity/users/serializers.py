from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from config import settings


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'email', 'password',
                  'address', 'latitude', 'longitude', 'description', 'mail_verified', 'key_expires_at']
        extra_kwargs = {'password': {'write_only': True},
                        'description': {'trim_whitespace': False,
                                        'max_length': settings.DESCRIPTION_MAX_LENGTH},
                        'mail_verified': {'read_only': True,
                                          'default': False},
                        'key_expires_at': {'read_only': True}}

    def validate(self, data):
        if 'description' not in data:
            data['description'] = ''
        return data

    def create(self, validated_data):
        user = self.Meta.model.objects.create_user(
            **{x: validated_data.get(x, None) for x in self.get_fields() if x is not 'id'})

        return user

    def update(self, user, validated_data):
        if 'email' in validated_data and validated_data['email'] != user.email:
            user.send_verification_code()
        return super().update(user, validated_data)


class VerifyMailSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=40, min_length=40)

    def validate_key(self, key):
        user = self.instance
        if user.key_expires_at < timezone.now():
            raise serializers.ValidationError('Key has expired')
        if key != user.activation_key:
            raise serializers.ValidationError('Key is invalid')
        return key

    def update(self, user, validated_data):
        "Mail is now verified, unset the data"
        user.mail_verified = True
        user.activation_key = ''
        user.key_expires_at = None
        user.save()
        return user
