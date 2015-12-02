def user(model):
    if not model.is_authenticated():
        return {}

    return {
        'id': model.id,
        'display_name': model.display_name,
        'first_name': model.first_name,
        'last_name': model.last_name,
    }


def category(model):
    return {
        'id': model.id,
        'name': model.name,
        'parent': model.parent_id,
    }


def item(model):
    return {
        'id': model.id,
        'user_id': model.user_id,
        'description': model.description,
    }


def group_summary(model):
    return {
        'id': model.id,
        'name': model.name,
        'description': model.description,
    }


def group(model):
    return {
        'id': model.id,
        'name': model.name,
        'description': model.description,
        'members': [user(member) for member in model.members.all()]
    }


def conversation(model):
    participants = [_['id'] for _ in model.participants.order_by('id').values('id')]
    newest_message = model.messages.order_by('-created_at').first()
    return {
        'id': model.id,
        'name': model.name,
        'participants': participants,
        'message': conversation_message(newest_message),
    }


def conversation_message(model):
    if model:
        return {
            'id': model.id,
            'sender': model.sent_by_id,
            'created_at': model.created_at.isoformat(),
            'content': model.content,
        }
    else:
        return None
