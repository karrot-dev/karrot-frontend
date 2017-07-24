from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import serializers

from config import settings
from django.utils.translation import ugettext as _


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'email', 'unverified_email', 'password',
                  'address', 'latitude', 'longitude', 'description', 'mail_verified',
                  'key_expires_at', 'current_group', 'language']
        extra_kwargs = {
            'email': {
                'required': True
            },
            'unverified_email': {
                'read_only': True
            },
            'password': {
                'write_only': True
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH},
            'mail_verified': {
                'read_only': True,
                'default': False},
            'key_expires_at': {
                'read_only': True
            }
        }

    def create(self, validated_data):
        user = self.Meta.model.objects.create_user(**validated_data)
        return user

    def update(self, user, validated_data):
        if 'email' in validated_data and validated_data['email'] != user.email:
            user.update_email(validated_data.pop('email'))
        if 'password' in validated_data:
            user.set_password(validated_data.pop('password'))
        if 'language' in validated_data and validated_data['language'] != user.language:
            user.update_language(validated_data.pop('language'))
        return super().update(user, validated_data)


class VerifyMailSerializer(serializers.Serializer):
    key = serializers.CharField(max_length=40, min_length=40)

    def validate_key(self, key):
        user = self.instance
        if user.key_expires_at < timezone.now():
            raise serializers.ValidationError(_('Key has expired'))
        if key != user.activation_key:
            raise serializers.ValidationError(_('Key is invalid'))
        return key

    def update(self, user, validated_data):
        user.verify_mail()
        return user
