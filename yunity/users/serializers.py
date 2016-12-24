import hashlib
from datetime import timedelta
from random import random

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone
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
        user = self.Meta.model.objects.create_user(
            **{x: validated_data.get(x, None) for x in self.get_fields() if x is not 'id'})
        UserSerializer._send_verification_code(user)

        return user

    def _send_verification_code(user):
        key = UserSerializer._get_activation_key(user.display_name)
        expires = timezone.now() + timedelta(days=7)
        user.activation_key = key
        user.key_expires = expires
        user.save()

        # TODO: set proper frontend url
        url = key

        send_mail("Verify your mail address",
                  "Here is your activation key: {}. It will be active for 7 days.".format(url),
                  settings.DEFAULT_FROM_EMAIL,
                  [user.email])

    def _get_activation_key(username):
        salt = hashlib.sha1(str(random()).encode()).hexdigest()[:5]
        return hashlib.sha1(salt.encode() + username.encode()).hexdigest()
