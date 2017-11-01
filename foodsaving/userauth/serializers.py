from django.conf import settings
from django.contrib.auth import authenticate, login, get_user_model
from rest_framework import serializers
from django.utils.translation import ugettext as _


class AuthLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        credentials = {'email': attrs.get('email'), 'password': attrs.get('password')}
        user = authenticate(**credentials)
        if user:
            login(self.context['request'], user)
        else:
            msg = 'Unable to login with provided credentials.'
            raise serializers.ValidationError(msg)

        return user


class AuthUserSerializer(serializers.ModelSerializer):
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

    def validate_email(self, email):
        action = self.context['view'].action
        user = self.context['request'].user
        similar = self.Meta.model.objects.filter_by_similar_email(email)
        if (action == 'create' and similar.exists()) \
                or (action == 'partial_update' and similar.exclude(id=user.id).exists()):
            raise serializers.ValidationError(_('Similar e-mail exists: ') + similar.first().email)
        return email

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