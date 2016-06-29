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
    id = serializers.IntegerField(read_only=True)
    date = serializers.DateTimeField()
    collector_ids = serializers.PrimaryKeyRelatedField(source='collectors', queryset=get_user_model().objects.all(), many=True)
    max_collectors = serializers.IntegerField()


class StoreSummarySerializer(StoreDetailSerializer):
    pickups = PickupDateSerializer(source='pickupdates', read_only=True, many=True)

