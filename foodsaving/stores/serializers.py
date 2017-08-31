from datetime import timedelta

import dateutil.rrule
from django.db import transaction
from django.utils import timezone
from django.utils.translation import ugettext as _
from rest_framework import serializers

from django.conf import settings
from foodsaving.history.utils import get_changed_data
from foodsaving.stores.models import (
    PickupDate as PickupDateModel,
    Feedback as FeedbackModel,
    PickupDateSeries as PickupDateSeriesModel,
    Store as StoreModel,
)
from foodsaving.stores.signals import post_pickup_create, post_pickup_modify, post_pickup_join, post_pickup_leave, \
    post_series_create, post_series_modify, post_store_create, post_store_modify


class PickupDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateModel
        fields = ['id', 'date', 'series', 'store', 'max_collectors', 'collector_ids', 'description']
        update_fields = ['date', 'max_collectors', 'description']
        extra_kwargs = {
            'series': {'read_only': True},
        }
    collector_ids = serializers.PrimaryKeyRelatedField(
        source='collectors',
        many=True,
        read_only=True
    )

    def validate_store(self, store):
        if not self.context['request'].user.groups.filter(store=store).exists():
            raise serializers.ValidationError(_('You are not member of the store\'s group.'))
        return store

    def create(self, validated_data):
        pickupdate = super().create(validated_data)
        post_pickup_create.send(
            sender=self.__class__,
            group=pickupdate.store.group,
            store=pickupdate.store,
            user=self.context['request'].user,
            payload=self.initial_data
        )
        return pickupdate

    def update(self, pickupdate, validated_data):
        selected_validated_data = {}
        for attr in self.Meta.update_fields:
            if attr in validated_data:
                selected_validated_data[attr] = validated_data[attr]
        changed_data = get_changed_data(pickupdate, selected_validated_data)

        if pickupdate.series:
            if 'max_collectors' in changed_data:
                selected_validated_data['is_max_collectors_changed'] = True
                if not pickupdate.is_max_collectors_changed:
                    changed_data['is_max_collectors_changed'] = True
            if 'date' in changed_data:
                selected_validated_data['is_date_changed'] = True
                if not pickupdate.is_date_changed:
                    changed_data['is_date_changed'] = True
            if 'description' in changed_data:
                selected_validated_data['is_description_changed'] = True
                if not pickupdate.is_description_changed:
                    changed_data['is_description_changed'] = True

        super().update(pickupdate, selected_validated_data)

        if changed_data:
            post_pickup_modify.send(
                sender=self.__class__,
                group=pickupdate.store.group,
                store=pickupdate.store,
                user=self.context['request'].user,
                payload=changed_data
            )
        return pickupdate

    def validate_date(self, date):
        if not date > timezone.now() + timedelta(minutes=10):
            raise serializers.ValidationError(_('The date should be in the future.'))
        return date


class PickupDateJoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateModel
        fields = []

    def update(self, pickup_date, validated_data):
        user = self.context['request'].user
        pickup_date.collectors.add(user)
        post_pickup_join.send(
            sender=self.__class__,
            group=pickup_date.store.group,
            store=pickup_date.store,
            user=user,
            payload=PickupDateSerializer(instance=pickup_date).data
        )
        return pickup_date


class PickupDateLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateModel
        fields = []

    def update(self, pickup_date, validated_data):
        user = self.context['request'].user
        pickup_date.collectors.remove(user)
        post_pickup_leave.send(
            sender=self.__class__,
            group=pickup_date.store.group,
            store=pickup_date.store,
            user=user,
            payload=PickupDateSerializer(instance=pickup_date).data
        )
        return pickup_date


class PickupDateSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PickupDateSeriesModel
        fields = ['id', 'max_collectors', 'store', 'rule', 'start_date', 'description']
        update_fields = ('max_collectors', 'start_date', 'rule', 'description')

    def create(self, validated_data):
        series = super().create(validated_data)
        series.update_pickup_dates()
        post_series_create.send(
            sender=self.__class__,
            group=series.store.group,
            store=series.store,
            user=self.context['request'].user,
            payload=self.initial_data
        )
        return series

    def update(self, series, validated_data):
        selected_validated_data = {}
        for attr in self.Meta.update_fields:
            if attr in validated_data:
                selected_validated_data[attr] = validated_data[attr]

        changed_data = get_changed_data(series, selected_validated_data)
        super().update(series, selected_validated_data)
        series.update_pickup_dates()

        if changed_data:
            post_series_modify.send(
                sender=self.__class__,
                group=series.store.group,
                store=series.store,
                user=self.context['request'].user,
                payload=changed_data
            )
        return series

    def validate_store(self, store):
        if not store.group.is_member(self.context['request'].user):
            raise serializers.ValidationError(_('You are not member of the store\'s group.'))
        return store

    def validate_start_date(self, date):
        date = date.replace(second=0, microsecond=0)
        return date

    def validate_rule(self, rule_string):
        rrule = dateutil.rrule.rrulestr(rule_string)
        if not isinstance(rrule, dateutil.rrule.rrule):
            raise serializers.ValidationError(_('Only single recurrence rules are allowed.'))
        return rule_string


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreModel
        fields = ['id', 'name', 'description', 'group',
                  'address', 'latitude', 'longitude',
                  'weeks_in_advance', 'upcoming_notification_hours']
        extra_kwargs = {
            'name': {
                'min_length': 3
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH
            }
        }

    def create(self, validated_data):
        store = super().create(validated_data)
        post_store_create.send(
            sender=self.__class__,
            group=store.group,
            store=store,
            user=self.context['request'].user,
            payload=self.initial_data
        )
        return store

    def update(self, store, validated_data):
        changed_data = get_changed_data(store, validated_data)
        store = super().update(store, validated_data)

        if 'weeks_in_advance' in changed_data:
            with transaction.atomic():
                for series in store.series.all():
                    series.update_pickup_dates()

        if changed_data:
            post_store_modify.send(
                sender=self.__class__,
                group=store.group,
                store=store,
                user=self.context['request'].user,
                payload=changed_data
            )
        return store

    def validate_group(self, group):
        if not group.is_member(self.context['request'].user):
            raise serializers.ValidationError(_('You are not a member of this group.'))
        return group

    def validate_weeks_in_advance(self, w):
        if w < 1:
            raise serializers.ValidationError(_('Set at least one week in advance'))
        return w


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackModel
        fields = ['id', 'weight', 'comment', 'about', 'given_by']
        read_only_fields = ('given_by',)

    def create(self, validated_data):
        validated_data['given_by'] = self.context['request'].user
        return super().create(validated_data)

    def validate_about(self, about):
        user = self.context['request'].user
        group = about.store.group
        if not group.is_member(user):
            raise serializers.ValidationError(_('You are not member of the store\'s group.'))
        if not about.is_collector(user):
            raise serializers.ValidationError(_('You aren\'t assigned to the pickup.'))
        return about
