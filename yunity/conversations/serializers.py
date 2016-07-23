from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.fields import CharField, DateTimeField, IntegerField, SerializerMethodField
from rest_framework.relations import PrimaryKeyRelatedField
from yunity.users.serializers import UserSerializer
from yunity.conversations.models import ConversationMessage as MessageModel, ConversationType
from yunity.conversations.models import Conversation as ConversationModel
from yunity.utils.session import RealtimeClientData

MAX_MESSAGE_LENGTH = 1000000
MAX_TOPIC_LENGTH = 150


class MessageSerializer(serializers.Serializer):
    content = CharField(max_length=MAX_MESSAGE_LENGTH)
    author = PrimaryKeyRelatedField(read_only=True)
    time = DateTimeField(read_only=True, source='created_at')

    def create(self, validated_data):
        message = MessageModel.objects.create(
            author_id=self.context['request'].user.id,
            in_conversation_id=self.context['request'].data['in_conversation_id'],
            **validated_data)

        serialized_message = self.to_representation(message)
        payload = {'conversation_id': message.in_conversation_id, 'message': serialized_message}
        RealtimeClientData.send_to_users(list(message.in_conversation.participants.values_list('id', flat=True)),
                                         RealtimeClientData.Types.CONVERSATION_MESSAGE,
                                         payload)

        return message


class ConversationSerializer(serializers.Serializer):
    topic = CharField(max_length=MAX_TOPIC_LENGTH, required=False)

    # Writing
    with_participants = PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=get_user_model().objects.all())
    message = CharField(max_length=MAX_MESSAGE_LENGTH, write_only=True)

    # Reading
    id = IntegerField(read_only=True)
    type = SerializerMethodField(read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    def get_type(self, obj):
        return ConversationType.name(obj.type)

    def create(self, validated_data):
        """
        Create new conversation with other user(s) and a message
        """
        message_data = {'content': validated_data.pop('message'),
                        'author_id': self.context['request'].user.id,
                        }

        participant_ids = [_.id for _ in validated_data.pop('with_participants')] + \
                          [self.context['request'].user.id, ]

        # Set default type
        if len(participant_ids) == 2:
            chat_type = ConversationType.ONE_ON_ONE
        else:
            chat_type = ConversationType.MULTICHAT

        chat = ConversationModel.objects.create(type=chat_type, **validated_data)
        chat.participants = participant_ids
        chat.save()

        # Todo: refactor to message serializer
        MessageModel.objects.create(
            in_conversation_id=chat.id,
            **message_data
        )

        return chat

    def validate_with_participants(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("No chat participants given")
        if len(value) == 1 and self.context['request'].user.id in value:
            raise serializers.ValidationError("Requesting user is only participant")
        return value


class ConversationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConversationModel
        fields = ['topic', ]
        extra_kwargs = {'topic': {'required': False, 'max_length': MAX_TOPIC_LENGTH}}
