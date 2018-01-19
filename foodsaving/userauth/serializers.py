from anymail.exceptions import AnymailAPIError
from django.conf import settings
from django.contrib.auth import authenticate, login, get_user_model
from django.utils.translation import ugettext as _
from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer

from foodsaving.userauth.models import VerificationCode


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

    photo = VersatileImageFieldSerializer(
        sizes='user_profile',
        required=False,
        allow_null=True,
        write_only=True
    )
    photo_urls = VersatileImageFieldSerializer(
        sizes='user_profile',
        read_only=True,
        source='photo'
    )

    class Meta:
        model = get_user_model()
        fields = ['id', 'display_name', 'email', 'unverified_email', 'password',
                  'address', 'latitude', 'longitude', 'description', 'mail_verified',
                  'current_group', 'language', 'photo', 'photo_urls']
        read_only_fields = ('unverified_email', 'mail_verified')
        extra_kwargs = {
            'password': {
                'write_only': True
            },
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
        if 'password' in validated_data:
            del validated_data['password']
        if 'email' in validated_data:
            latest_email = user.email if user.email == user.unverified_email else user.unverified_email
            if validated_data['email'] != latest_email:
                try:
                    user.update_email(validated_data.pop('email'))
                except AnymailAPIError:
                    raise serializers.ValidationError(_('We could not send you an e-mail.'))
        if 'language' in validated_data and validated_data['language'] != user.language:
            user.update_language(validated_data.pop('language'))
        if 'photo' in validated_data and validated_data['photo'] is None:
            user.delete_photo()

        return super().update(user, validated_data)


class VerifyMailSerializer(serializers.Serializer):
    # TODO: Rename to 'verification_code' (will change the API!)
    key = serializers.CharField(max_length=50, min_length=20)

    def validate_key(self, code):  # TODO: Rename to 'validate_code'
        user = self.instance

        try:
            matched_code = VerificationCode.objects.get(user=user, type=VerificationCode.EMAIL_VERIFICATION, code=code)
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError(_('Verification code is invalid'))

        if matched_code.has_expired():
            raise serializers.ValidationError(_('Verification code has expired'))

        return code

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
