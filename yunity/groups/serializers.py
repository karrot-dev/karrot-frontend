from rest_framework import serializers
from yunity.groups.models import Group as GroupModel


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupModel
        fields = ['id', 'name', 'description', 'members', 'address', 'latitude', 'longitude']
        extra_kwargs = {
            'members': {'read_only': True}
        }

    def create(self, validated_data):
        member_ids = [self.context['request'].user.id, ]

        group = GroupModel.objects.create(**validated_data)
        group.members = member_ids
        group.save()

        return group
