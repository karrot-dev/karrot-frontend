from rest_framework import serializers

from foodsaving.conversations.models import Conversation, ConversationMessage


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            'id',
            'participants',
            'created_at'
        ]

    def retrieve(self, validated_data):
        user = self.context['request'].user
        return ConversationMessage.objects.create(author=user, **validated_data)


class ConversationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationMessage
        fields = [
            'id',
            'author',
            'content',
            'conversation',
            'created_at'
        ]


class CreateConversationMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationMessage
        fields = [
            'id',
            'author',
            'content',
            'conversation'
        ]
        extra_kwargs = {
            'author': {
                'read_only': True
            }
        }

    def create(self, validated_data):
        user = self.context['request'].user
        return ConversationMessage.objects.create(author=user, **validated_data)
