from rest_framework import serializers
from rest_framework.fields import CharField, DateTimeField, SerializerMethodField
from rest_framework.relations import PrimaryKeyRelatedField
from yunity.api.serializers import UserSerializer
from yunity.conversations.models import ConversationMessage as MessageModel, ConversationType
from yunity.conversations.models import Conversation as ConversationModel
from yunity.users.models import User as UserModel


class MessageSerializer(serializers.Serializer):
    content = CharField(max_length=100000)
    author = PrimaryKeyRelatedField(read_only=True)
    time = DateTimeField(read_only=True, source='created_at')

    def create(self, validated_data):
        message = MessageModel.objects.create(
            sent_by_id=self.context['request'].user.id,
            in_conversation_id=self.context['request'].data['in_conversation_id'],
            **validated_data)

        return message


class ConversationSerializer(serializers.Serializer):
    topic = CharField(max_length=150, required=False)

    # Writing
    with_participants = PrimaryKeyRelatedField(many=True, write_only=True, queryset=UserModel.objects.all())
    message = CharField(max_length=100000, write_only=True)

    # Reading
    id = PrimaryKeyRelatedField(read_only=True)
    type = SerializerMethodField(read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    def get_type(self, obj):
        return ConversationType.name(obj.type)

    def create(self, validated_data):
        """
        Create new conversation with other users and a message
        """
        participant_ids = [_.id for _ in validated_data['with_participants']] + \
                            [self.context['request'].user.id, ]
        if len(participant_ids) > 2:
            chat_type = ConversationType.MULTICHAT
        else:
            chat_type = ConversationType.ONE_ON_ONE

        chat = ConversationModel.objects.create(type=chat_type)
        chat.participants = participant_ids
        chat.save()

        MessageModel.objects.create(
            sent_by_id=self.context['request'].user.id,
            in_conversation_id=chat.id,
            content=validated_data['message']['content'],
        )

        return chat

    def update(self, conversation, validated_data):
        conversation.name = validated_data.get('name', conversation.name)
        conversation.save()
        return conversation

    def validate_with_participants(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("No chat participants given")
        if len(value) == 1 and self.context['request'].user.id in value:
            raise serializers.ValidationError("Requesting user is only participant")
        return value
