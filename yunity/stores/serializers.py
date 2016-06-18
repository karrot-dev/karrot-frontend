from django.contrib.auth import get_user_model
from rest_framework import serializers
from yunity.groups.models import Group
from yunity.stores.models import Store as StoreModel


class StoreDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField()
    group = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all())

    def create(self, validated_data):
        return StoreModel.objects.create(**validated_data)


class PickupDateSerializer(serializers.Serializer):
    date = serializers.DateTimeField()
    user_ids = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(), many=True)


class StoreSummarySerializer(serializers.Serializer):
    details = StoreDetailSerializer(read_only=True)
    pickups = PickupDateSerializer(read_only=True, many=True)

