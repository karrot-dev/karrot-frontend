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
                  'mobile_number', 'address', 'latitude', 'longitude',
                  'description', 'mail_verified', 'current_group',
                  'language', 'photo', 'photo_urls']
        read_only_fields = ('unverified_email', 'mail_verified')
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH
            },
            'mail_verified': {
                'default': False
            },
        }

    def validate_email(self, email):
        if self.context['request'].method != 'POST':
            return email

        similar = get_user_model().objects.filter_by_similar_email(email)
        if similar.exists():
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
            del validated_data['email']
        if 'language' in validated_data and validated_data['language'] != user.language:
            user.update_language(validated_data.pop('language'))
        if 'photo' in validated_data and validated_data['photo'] is None:
            user.delete_photo()

        return super().update(user, validated_data)


class VerificationCodeSerializer(serializers.Serializer):
    code = serializers.CharField()

    def validate_code(self, code):
        try:
            matched_code = VerificationCode.objects.get(code=code, type=self.context['type'])
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError(_('Verification code is invalid'))

        if matched_code.has_expired():
            raise serializers.ValidationError(_('Verification code has expired'))

        self.instance = matched_code.user
        return code

    def _update(self, user, validated_data):
        type = self.context['type']

        if type == VerificationCode.EMAIL_VERIFICATION:
            user.verify_mail()
        elif type == VerificationCode.PASSWORD_RESET:
            user.change_password(validated_data['new_password'])
        elif type == VerificationCode.ACCOUNT_DELETE:
            user.erase()

    def update(self, user, validated_data):
        try:
            self._update(user, validated_data)
        except AnymailAPIError:
            raise serializers.ValidationError(_('We could not send you an e-mail.'))
        return user


class ResetPasswordSerializer(VerificationCodeSerializer):
    new_password = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()

    def validate_old_password(self, old_password):
        if not self.instance.check_password(old_password):
            raise serializers.ValidationError(_('Wrong password'))
        return old_password

    def update(self, user, validated_data):
        try:
            user.change_password(validated_data['new_password'])
        except AnymailAPIError:
            raise serializers.ValidationError(_('We could not send you an e-mail.'))
        return user


class ChangeMailSerializer(serializers.Serializer):
    password = serializers.CharField()
    new_email = serializers.EmailField()

    def validate_password(self, password):
        if not self.instance.check_password(password):
            raise serializers.ValidationError(_('Wrong password'))
        return password

    def validate_new_email(self, email):
        similar = get_user_model().objects.filter_by_similar_email(email)
        if similar.exclude(id=self.instance.id).exists():
            raise serializers.ValidationError(_('Similar e-mail exists: ') + similar.first().email)
        return email

    def update(self, user, validated_data):
        new_email = validated_data['new_email']

        if user.email == new_email:
            if user.unverified_email != new_email:
                user.restore_email()
        else:
            try:
                user.update_email(new_email)
            except AnymailAPIError:
                raise serializers.ValidationError(_('We could not send you an e-mail.'))
        return user


class RequestResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, email):
        UserModel = get_user_model()

        try:
            self.instance = UserModel.objects.active().get(email__iexact=email)
        except UserModel.DoesNotExist:
            raise serializers.ValidationError(_('Unknown e-mail address'))

        return email

    def update(self, user, validated_data):
        try:
            user.send_password_reset_verification_code()
        except AnymailAPIError:
            raise serializers.ValidationError(_('We could not send you an e-mail.'))
        return user
