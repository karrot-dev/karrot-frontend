from datetime import timedelta

import dateutil.rrule
from django.db import transaction
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
        update_fields = ['date', 'max_collectors']
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
        about_to_change = any([(_ in validated_data) for _ in self.Meta.update_fields])
        if not about_to_change:
            return pickupdate

        for attr in self.Meta.update_fields:
            if attr in validated_data:
                setattr(pickupdate, attr, validated_data.pop(attr))
            if pickupdate.series:
                if attr == 'max_collectors':
                    pickupdate.is_max_collectors_changed = True
                elif attr == 'date':
                    pickupdate.is_date_changed = True
        pickupdate.save()
        return pickupdate

    def validate_date(self, date):
        if not date > timezone.now() + timedelta(minutes=10):
            raise serializers.ValidationError('The date should be in the future.')
        return date


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
        date = date.replace(second=0, microsecond=0)
        return date

    def validate_rule(self, rule_string):
        rrule = dateutil.rrule.rrulestr(rule_string)
        if not isinstance(rrule, dateutil.rrule.rrule):
            raise serializers.ValidationError('we only handle single rrules')
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

    def update(self, instance, validated_data):
        update_generated_pickups = False
        if 'weeks_in_advance' in validated_data and validated_data['weeks_in_advance'] != instance.weeks_in_advance:
            update_generated_pickups = True
        instance = super().update(instance, validated_data)

        if update_generated_pickups:
            with transaction.atomic():
                for series in instance.series.all():
                    series.update_pickup_dates()

        return instance

    def validate(self, data):
        if 'description' not in data:
            data['description'] = ''
        return data

    def validate_group(self, group_id):
        if group_id not in self.context['request'].user.groups.all():
            raise serializers.ValidationError('You are not member of the given group.')
        return group_id

    def validate_weeks_in_advance(self, w):
        if w < 1:
            raise serializers.ValidationError('Set at least one week in advance')
        return w
