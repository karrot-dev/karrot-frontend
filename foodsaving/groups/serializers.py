import pytz
from django.conf import settings
from django.utils.translation import ugettext as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from foodsaving.groups.models import Group as GroupModel, GroupMembership
from foodsaving.groups.signals import post_group_modify, post_group_create
from foodsaving.history.utils import get_changed_data
from . import roles


class TimezoneField(serializers.Field):
    def to_representation(self, obj):
        return str(obj)

    def to_internal_value(self, data):
        try:
            return pytz.timezone(str(data))
        except pytz.exceptions.UnknownTimeZoneError:
            raise ValidationError(_('Unknown timezone'))


class GroupMembershipInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMembership
        fields = ('created_at', 'roles')
        extra_kwargs = {
            'created_at': {
                'read_only': True
            },
            'roles': {
                'read_only': True
            },
        }


class GroupDetailSerializer(serializers.ModelSerializer):
    "use this also for creating and updating a group"

    class Meta:
        model = GroupModel
        fields = [
            'id',
            'name',
            'description',
            'public_description',
            'members',
            'memberships',
            'address',
            'latitude',
            'longitude',
            'password',
            'timezone',
            'slack_webhook'
        ]
        extra_kwargs = {
            'name': {
                'min_length': 5
            },
            'members': {
                'read_only': True
            },
            'description': {
                'trim_whitespace': False,
                'max_length': settings.DESCRIPTION_MAX_LENGTH
            },
            'password': {
                'trim_whitespace': False,
                'max_length': 255
            }
        }

    memberships = serializers.SerializerMethodField()

    def get_memberships(self, group):
        return {m.user_id: GroupMembershipInfoSerializer(m).data for m in group.groupmembership_set.all()}

    timezone = TimezoneField()

    def update(self, group, validated_data):
        changed_data = get_changed_data(group, validated_data)
        group = super().update(group, validated_data)

        if changed_data:
            post_group_modify.send(
                sender=self.__class__,
                group=group,
                user=self.context['request'].user,
                payload=changed_data)
        return group

    def create(self, validated_data):
        user = self.context['request'].user
        group = GroupModel.objects.create(**validated_data)
        GroupMembership.objects.create(group=group, user=user)
        post_group_create.send(sender=self.__class__, group=group, user=user, payload=self.initial_data)
        return group


class GroupPreviewSerializer(serializers.ModelSerializer):
    """
    Public information for all visitors
    should be readonly
    """

    class Meta:
        model = GroupModel
        fields = [
            'id',
            'name',
            'public_description',
            'address',
            'latitude',
            'longitude',
            'members',
            'protected'
        ]

    protected = serializers.SerializerMethodField()

    def get_protected(self, group):
        return group.password != ''


class GroupJoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupModel
        fields = ['password']

    def validate(self, attrs):
        if self.instance.password != '' and self.instance.password != attrs.get('password'):
            raise ValidationError(_('Group password is wrong'))
        return attrs

    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.add_member(user)
        return instance


class GroupLeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupModel
        fields = []

    def update(self, instance, validated_data):
        user = self.context['request'].user
        instance.remove_member(user)
        return instance


class TimezonesSerializer(serializers.Serializer):
    all_timezones = serializers.ListField(
        child=serializers.CharField(),
        read_only=True
    )


class GroupMembershipUpdateSerializer(serializers.ModelSerializer):
    """
    Handle modifications to group memberships.

    It's a bit of a hack, as it's used in the context of the Group viewsets, so self.instance is a Group, but
    we define a GroupMembership ModelSerializer here. It works on the basis that so long as it doesn't go down
    certain code paths it will never know it has a Group instance instead of a GroupMembership one... shhhhhhhhhhh.
    """

    class Meta:
        model = GroupMembership
        fields = [
            # used to find the correct membership within the group
            'user',

            # modifications that we want to make to the membership
            'add_roles', 'remove_roles',

            # information to return
            *GroupMembershipInfoSerializer.Meta.fields
        ]
        extra_kwargs = GroupMembershipInfoSerializer.Meta.extra_kwargs

    user = serializers.IntegerField(default=0)

    add_roles = serializers.ListField(
        child=serializers.ChoiceField(
            choices=(roles.GROUP_MEMBERSHIP_MANAGER,)
        ),
        default=list
    )

    remove_roles = serializers.ListField(
        child=serializers.CharField(),
        default=list
    )

    roles = serializers.ListField(child=serializers.CharField(), default=list, read_only=True)

    def validate_user(self, value):
        group = self.instance
        if not GroupMembership.objects.filter(group=group, user_id=value).exists():
            raise ValidationError(_('User is not in group'))
        return value

    def update(self, group, validated_data):
        user_id = validated_data['user']
        membership = GroupMembership.objects.filter(group=group, user_id=user_id).first()

        for role in validated_data.get('add_roles', []):
            if role not in membership.roles:
                membership.roles.append(role)

        for role in validated_data.get('remove_roles', []):
            while role in membership.roles:
                membership.roles.remove(role)

        membership.save()

        return GroupMembershipInfoSerializer(membership).data
