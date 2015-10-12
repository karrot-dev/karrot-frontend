from django.conf.urls import url
from django.db import IntegrityError
from django.db.models import Q, Max
from django.db.transaction import atomic
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.ids import chat_id_uri_pattern, user_id_uri_pattern
from yunity.api.validation import validate_chat_message, validate_chat_participants, validate_chat_name, \
    validate_chat_message_type, validate_chat_message_content, validate_chat_users
from yunity.utils.api.abc import ApiBase, body_as_json, resource_as
from yunity.utils.request import Parameter
from yunity.models.concrete import Chat as ChatModel
from yunity.models.concrete import Message as MessageModel
from yunity.models.concrete import User as UserModel


def user_has_rights_to_chat(chatid, userid):
    return ChatModel.objects \
        .filter(id=chatid) \
        .filter(Q(participants=userid) | Q(administrated_by=userid)) \
        .exists()


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

class Chats(ApiBase, View):
    def get(self, request):
        """List all chats in which the currently logged in user is involved.
        The chats are in descending order of the most recent message time; this means that the first element of the
        chats list is the chat with the most recent activity. The most recent message is included.
        ---
        tags:
            - Chat
        responses:
            200:
                description: A list of all the chats the logged in user is involved.
                schema:
                    type: object
                    required:
                      - chats
                    properties:
                        chats:
                            type: array
                            items:
                                $ref: '#/definitions/chat_information'
        ...

        :type request: HttpRequest

        """
        chats = ChatModel.objects \
            .filter(participants__id__in=[request.user.id]) \
            .annotate(latest_message_time=Max('messages__created_at')) \
            .order_by('-latest_message_time')

        return self.success({'chats': [chat_to_dict(chat) for chat in chats]})

    @body_as_json(parameters=(
        Parameter(name='message', validator=validate_chat_message),
        Parameter(name='participants', validator=validate_chat_participants),
    ))
    def post(self, request):
        """Create a new chat involving participants and add the first message.
        ---
        tags:
            - Chat
        parameters:
            - in: body
              name: body
              schema:
                  id: create_chat
                  required:
                    - message
                    - participants
                  properties:
                      message:
                          $ref: '#/definitions/send_message'
                      participants:
                          type: array
                          example: [1, 742, 23]
                          description: List of participants that will be added to the chat
                          items:
                              type: integer
        responses:
            201:
                description: Chat created
                schema:
                    id: chat_information
                    type: object
                    required:
                      - id
                      - name
                      - participants
                      - message
                    properties:
                      id:
                        type: number
                        description: Identifier of the chat
                        example: 3
                      name:
                        type: string
                        example: Planning of next party
                        description: Custom name for the chat
                      participants:
                        type: array
                        items:
                            type: integer
                        example: [1, 87, 633, 234]
                        description: The list of userids participating in the chat
                      message:
                          $ref: '#/definitions/message'

            403:
                description: Insufficient rights to create this chat. (Include yourself into the participants or do not
                             create a chat with more than XX users
                schema:
                    $ref: '#/definitions/result_error_forbidden'
        ...


        :type request: HttpRequest
        :rtype JsonResponse

        """
        chat = ChatModel.objects.create()
        chat.participants = request.body['participants']
        chat.save()

        MessageModel.objects.create(
            sent_by_id=request.user.id,
            in_conversation_id=chat.id,
            type=request.body['message']['type'],
            content=request.body['message']['content'],
        )

        return self.created({'id': chat.id})


class Chat(ApiBase, View):
    @resource_as('chatid', item_type=int)
    @body_as_json(parameters=[
        Parameter(name='name', validator=validate_chat_name),
    ])
    def put(self, request, chatid):
        """Update details about specific chat
        ---
        tags:
            - Chat
        parameters:
            - in: body
              name: body
              schema:
                  id: modify_chat
                  required:
                    - name
                  properties:
                      name:
                          type: string
                          example: Peter's chat
                          description: User defined name of chat
        responses:
            200:
                description: Chat modified
                schema:
                    $ref: '#/definitions/chat_information'

            403:
                description: The logged in user is not part of the conversation
                schema:
                    $ref: '#/definitions/result_error_forbidden'
        ...

        :type request: HttpRequest
        :type chatid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')

        chat = ChatModel.objects.get(id=chatid)
        chat.name = request.body['name']
        chat.save()

        return self.success(chat_to_dict(chat))


class ChatMessages(ApiBase, View):
    @resource_as('chatid', item_type=int)
    @body_as_json(parameters=[
        Parameter(name='type', validator=validate_chat_message_type),
        Parameter(name='content', validator=validate_chat_message_content),
    ])
    def post(self, request, chatid):
        """ Send a new message in given chat
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chatid
              description: ID of chat
              type: integer
            - in: body
              name: body
              schema:
                  id: send_message
                  required:
                    - type
                    - content
                  properties:
                      type:
                          type: string
                          enum: [TEXT, IMAGE]
                          description: Type of this message
                          example: TEXT
                      content:
                          type: string
                          example: Hi Peter, how are you?
                          description: Content, e.g. utf8-formatted plain text or image id received by the upload endpoint
        responses:
            201:
                description: Chat message added
                schema:
                    id: message
                    type: object
                    required:
                      - type
                      - content
                      - sender
                      - created_at
                      - id
                    properties:
                        type:
                            type: string
                            enum: [TEXT, IMAGE]
                            description: Type of this message
                            example: TEXT
                        content:
                            type: string
                            example: Hi Peter, how are you?
                            description: Content, e.g. utf8-formatted plain text or image id received by the upload endpoint
                        sender:
                            type: integer
                            description: Userid of sender of message
                            example: 82
                        created_at:
                            type: string
                            description: ISO 8601 formatted timestring in UTC timezone (YYYY-MM-DDTHH:MM:SS)
                            example: 2007-12-24T18:21:00.003423
                        id:
                            type: integer
                            description: Unique identifier of this message
                            example: 124624

            403:
                description: The logged in user is not part of the conversation
                schema:
                    $ref: '#/definitions/result_error_forbidden'
        ...

        :type request: HttpRequest
        :type chatid: int
        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')

        message = MessageModel.objects.create(
            sent_by=request.user,
            in_conversation_id=chatid,
            type=request.body['type'],
            content=request.body['content'],
        )

        return self.created(message_to_dict(message))

    @resource_as('chatid', item_type=int)
    def get(self, request, chatid):
        """Retrieve all the messages in the given chat, sorted descending by time (most recent first).
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chatid
              description: ID of chat
              type: integer
            - in: query
              name: take
              description: Number of messages to retrieve
              type: integer
            - in: query
              name: before_id
              description: The newest retrieved message is the first earlier one than this ID
              type: integer
        responses:
            200:
                description: Result message set
                schema:
                    id: result_messages
                    type: object
                    required:
                      - messages
                    properties:
                        messages:
                            type: array
                            items:
                                $ref: '#/definitions/message'

            403:
                description: The logged in user is not part of the conversation
                schema:
                    id: result_error_forbidden
                    type: object
                    required:
                      - reason
                    properties:
                        reason:
                            type: string
        ...


        :type request: HttpRequest
        :type chatid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')

        messages = MessageModel.objects \
            .filter(in_conversation=chatid) \
            .order_by('-created_at')

        take = request.GET.get('take')
        before_id = request.GET.get('before_id')
        if take is None and before_id is None:
            messages = messages.all()
        if before_id is not None:
            before_time = MessageModel.objects.get(id=int(before_id)).created_at
            messages = messages.filter(created_at__lt=before_time).all()
        if take is not None:
            messages = messages[:int(take)]

        return self.success({
            'messages': [message_to_dict(message) for message in messages]
        })


class ChatParticipants(ApiBase, View):
    @resource_as('chatid', item_type=int)
    @body_as_json(parameters=[
        Parameter(name='users', validator=validate_chat_users),
    ])
    def post(self, request, chatid):
        """Add a list of users to the chat.
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chatid
              description: ID of chat
              type: integer
            - in: body
              name: body
              schema:
                  id: chatusers
                  required:
                      - users
                  properties:
                      users:
                          type: array
                          description: List of users to add to this specific chat
                          example: [1, 5, 8]
                          items:
                              type: number
        responses:
            201:
                description: All users added
            400:
                description: At least one user does not exist, none added
            403:
                description: The user does not have the rights to add participants to the chat
        ...

        :type request: HttpRequest
        :type chatid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')

        try:
            with atomic():
                ChatModel.objects \
                    .get(id=chatid) \
                    .participants \
                    .add(*request.body['users'])
        except IntegrityError as e:
            return self.error(reason='A supplied user does not exist')

        return self.created()


class ChatParticipant(ApiBase, View):
    @resource_as('chatid', item_type=int)
    @resource_as('userid', item_type=int)
    def delete(self, request, chatid, userid):
        """Remove a user from the chat.
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chatid
              description: ID of chat
              type: integer
            - in: path
              name: userid
              description: ID of user to remove from chat
              type: integer
        responses:
            204:
                description: Participant deleted
            403:
                description: The logged in user is not part of the conversation
                schema:
                    $ref: '#/definitions/result_error_forbidden'
        ...

        :type request: HttpRequest
        :type chatid: int
        :type userid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')

        chat = ChatModel.objects.get(id=chatid)
        user = UserModel.objects.get(id=userid)

        chat.participants.remove(user)

        return self.deleted()

urlpatterns = [
    url(r'^$', Chats.as_view()),
    url(r'^{chatid}/?$'.format(chatid=chat_id_uri_pattern), Chat.as_view()),
    url(r'^{chatid}/messages/?$'.format(chatid=chat_id_uri_pattern), ChatMessages.as_view()),
    url(r'^{chatid}/participants/?$'.format(chatid=chat_id_uri_pattern), ChatParticipants.as_view()),
    url(r'^{chatid}/participants/{userid}/?$'.format(chatid=chat_id_uri_pattern, userid=user_id_uri_pattern),
        ChatParticipant.as_view()),
]
