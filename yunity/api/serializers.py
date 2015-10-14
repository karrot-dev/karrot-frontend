def user(model):
    if not model.is_authenticated():
        return {}

    return {
        'id': model.id,
        'display_name': model.display_name,
        'picture_url': model.picture_url,
    }


def category(model):
    return {
        'id': model.id,
        'name': model.name,
        'parent': model.parent_id,
    }


def chat(model):
    participants = [_['id'] for _ in model.participants.order_by('id').values('id')]
    newest_message = model.messages.order_by('-created_at').first()
    return {
        'id': model.id,
        'name': model.name,
        'participants': participants,
        'message': message(newest_message),
    }


def message(model):
    return {
        'id': model.id,
        'sender': model.sent_by_id,
        'created_at': model.created_at.isoformat(),
        'type': model.type,
        'content': model.content,
    }
