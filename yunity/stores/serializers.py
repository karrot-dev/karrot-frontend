from datetime import timedelta

import dateutil.rrule
from django.utils import timezone
from rest_framework import serializers

from config import settings
from yunity.stores.models import Store as StoreModel
from yunity.stores.models import PickupDateSeries as PickupDateSeriesModel
from yunity.stores.models import PickupDate as PickupDateModel


class PickupDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateModel
        fields = ['id', 'date', 'series', 'store', 'max_collectors', 'collector_ids']
        extra_kwargs = {
            'series': {'read_only': True},
        }
    collector_ids = serializers.PrimaryKeyRelatedField(
        source='collectors',
        many=True,
        read_only=True
    )

    def create(self, validated_data):
        if self.context['request'].user not in validated_data['store'].group.members.all():
            raise serializers.ValidationError('not a member of the group')
        return self.Meta.model.objects.create(**validated_data)

    def update(self, pickupdate, validated_data):
        # TODO: fail if store gets changed
        pickupdate.date = validated_data.get('date', pickupdate.date)
        pickupdate.max_collectors = validated_data.get('max_collectors', pickupdate.max_collectors)
        pickupdate.save()
        return pickupdate

    def validate_date(self, date):
        if not date > timezone.now() + timedelta(minutes=10):
            raise serializers.ValidationError('The date should be in the future.')
        return date

    def validate_max_collectors(self, val):
        if not val > 0:
            raise serializers.ValidationError('The number of collectors should be greater than 0.')
        return val


class PickupDateSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateSeriesModel
        fields = ['id', 'max_collectors', 'store', 'rule', 'start_date']

    def create(self, validated_data):
        series = self.Meta.model.objects.create(**validated_data)
        series.update_pickup_dates()
        return series

    def update(self, series, validated_data):
        for attr in ('max_collectors', 'start_date', 'rule'):
            if attr in validated_data:
                setattr(series, attr, validated_data.get(attr))
        series.save()
        series.update_pickup_dates()
        return series

    def validate_store(self, store_id):
        if not self.context['request'].user.groups.filter(store=store_id).all():
            raise serializers.ValidationError('You are not member of the store\'s group.')
        return store_id

    def validate_start_date(self, date):
        if timezone.is_naive(date):
            return serializers.ValidationError('should be timezone-aware (contain timezone information)')
        date = date.replace(second=0, microsecond=0)
        return date

    def validate_max_collectors(self, val):
        if not val > 0:
            raise serializers.ValidationError('The number of collectors should be greater than 0.')
        return val

    def validate_rule(self, rule_string):
        rrule = dateutil.rrule.rrulestr(rule_string)
        if not isinstance(rrule, dateutil.rrule.rrule):
            raise Exception('we only handle single rrules')
        return rule_string


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreModel
        fields = ['id', 'name', 'description', 'group', 'address', 'latitude', 'longitude', 'weeks_in_advance']
        extra_kwargs = {
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH
            }
        }

    def validate(self, data):
        if 'description' not in data:
            data['description'] = ''
        return data

    def validate_group(self, group_id):
        if group_id not in self.context['request'].user.groups.all():
            raise serializers.ValidationError('You are not member of the given group.')
        return group_id
