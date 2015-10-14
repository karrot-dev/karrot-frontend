def user_to_dict(user):
    if not user.is_authenticated():
        return {}

    return {
        'id': user.id,
        'display_name': user.display_name,
        'picture_url': user.picture_url,
    }


def category_to_dict(category):
    return {
        'id': category.id,
        'name': category.name,
        'parent': category.parent_id,
    }


def chat_to_dict(chat):
    participants = [_['id'] for _ in chat.participants.order_by('id').values('id')]
    newest_message = chat.messages.order_by('-created_at').first()
    return {
        'id': chat.id,
        'name': chat.name,
        'participants': participants,
        'message': message_to_dict(newest_message),
    }


def message_to_dict(message):
    return {
        'id': message.id,
        'sender': message.sent_by_id,
        'created_at': message.created_at.isoformat(),
        'type': message.type,
        'content': message.content,
    }
