from django.utils import timezone
from django.utils.translation import ugettext as _
from rest_framework import serializers

from foodsaving.invitations.models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = ['id', 'email', 'group', 'inviter', 'expires_at']
        extra_kwargs = {
            'inviter': {'read_only': True}
        }

    def create(self, validated_data):
        validated_data['inviter'] = self.context['request'].user
        return self.Meta.model.objects.create_and_send(**validated_data)


class InvitationAcceptSerializer(serializers.Serializer):
    def validate(self, attrs):
        invitation = self.instance
        if invitation.expires_at < timezone.now():
            raise serializers.ValidationError(_('Key has expired'))
        return attrs

    def update(self, invitation, validated_data):
        invitation.accept(self.context['request'].user)
        return invitation
