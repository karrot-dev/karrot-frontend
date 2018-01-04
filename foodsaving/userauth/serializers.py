from anymail.exceptions import AnymailAPIError
from django.conf import settings
from django.contrib.auth import authenticate, login, get_user_model
from django.utils import timezone
from django.utils.translation import ugettext as _
from rest_framework import serializers


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
        fields = ['id', 'display_name', 'email', 'unverified_email',
                  'address', 'latitude', 'longitude', 'description', 'mail_verified',
                  'key_expires_at', 'current_group', 'language']
        read_only_fields = ('unverified_email', 'key_expires_at', 'mail_verified')
        extra_kwargs = {
            'email': {
                'required': True
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH},
            'mail_verified': {
                'default': False
            },
        }

    def validate_email(self, email):
        user = self.context['request'].user
        similar = self.Meta.model.objects.filter_by_similar_email(email)
        if (self.instance is None and similar.exists()) \
                or (self.instance is not None and similar.exclude(id=user.id).exists()):
            raise serializers.ValidationError(_('Similar e-mail exists: ') + similar.first().email)
        return email

    def validate_current_group(self, group):
        user = self.context['request'].user
        if group and not group.is_member(user):
            raise serializers.ValidationError()
        return group

    def create(self, validated_data):
        try:
            user = self.Meta.model.objects.create_user(**validated_data)
        except AnymailAPIError:
            raise serializers.ValidationError(_('We could not send you an e-mail.'))
        return user

    def update(self, user, validated_data):
        if 'email' in validated_data:
            latest_email = user.email if user.email == user.unverified_email else user.unverified_email
            if validated_data['email'] != latest_email:
                try:
                    user.update_email(validated_data.pop('email'))
                except AnymailAPIError:
                    raise serializers.ValidationError(_('We could not send you an e-mail.'))
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


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

    def validate_old_password(self, old_password):
        if not self.instance.check_password(old_password):
            raise serializers.ValidationError()
        return old_password

    def update(self, user, validated_data):
        user.set_password(validated_data['new_password'])
        user.save()
        return user
