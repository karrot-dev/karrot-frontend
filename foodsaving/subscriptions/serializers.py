from rest_framework import serializers
from rest_framework.fields import SerializerMethodField, CurrentUserDefault
from rest_framework.validators import UniqueTogetherValidator

from foodsaving.subscriptions.models import PushSubscription, PushSubscriptionPlatform
from foodsaving.users.serializers import UserSerializer


class PushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushSubscription
        fields = [
            'id',
            'token',
            'platform'
        ]

    platform = SerializerMethodField()

    def get_platform(self, obj):
        return PushSubscriptionPlatform.name(obj.platform).lower()


class CreatePushSubscriptionSerializer(PushSubscriptionSerializer):
    class Meta(PushSubscriptionSerializer.Meta):
        fields = PushSubscriptionSerializer.Meta.fields + [
            'user'
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=PushSubscription.objects.all(),
                fields=PushSubscription._meta.unique_together[0]  # only supports first tuple
            )
        ]

    # user field is only here so make the UniqueTogetherValidator work
    # https://stackoverflow.com/a/27239870
    # https://github.com/encode/django-rest-framework/issues/2164#issuecomment-65196943
    user = UserSerializer(
        read_only=True,
        default=CurrentUserDefault()
    )
