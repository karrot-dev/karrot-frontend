from django.db import transaction
from yunity.conversations.models import ConversationType, Conversation as ConversationModel,\
    ConversationMessage as MessageModel


def get_or_create_user_conversation(participants):
    conversation = ConversationModel.objects.filter(type=ConversationType.ONE_ON_ONE)
    for p in participants:
        conversation = conversation.filter(participants__id=p)

    conversation = conversation.first()

    if not conversation:
        try:
            with transaction.atomic():
                conversation = ConversationModel.objects.create(type=ConversationType.ONE_ON_ONE)
                conversation.participants = participants
                conversation.save()
        except:
            conversation = None
            pass

    return conversation

def add_to_conversation(conversation_id, author_id, data):
    MessageModel.objects.create(author_id=author_id,
                                in_conversation_id=conversation_id,
                                content=data['message'])
