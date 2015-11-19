from django.conf.urls import url
from django.db import IntegrityError
from django.db.models import Max
from django.http import HttpRequest

from django.views.generic import View

from yunity.api.ids import chat_id_uri_pattern, user_id_uri_pattern
from yunity.api import types, serializers
from yunity.utils.api.abc import ApiBase
from yunity.utils.api.decorators import json_request, request_parameter, uri_resource, permissions_required_for, \
    rollback_on
from yunity.models.concrete import Conversation as ConversationModel, ConversationType
from yunity.models.concrete import ConversationMessage as MessageModel
from yunity.models.concrete import User as UserModel
from yunity.utils.session import RealtimeClientData


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
        chats = ConversationModel.objects \
            .filter(participants__id__in=[request.user.id]) \
            .annotate(latest_message_time=Max('messages__created_at')) \
            .order_by('-latest_message_time')

        return self.success({'chats': [serializers.conversation(chat) for chat in chats]})

    @json_request
    @request_parameter('message', of_type=types.message)
    @request_parameter('participants', of_type=types.list_of_userids)
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
        chat = ConversationModel.objects.create(type=ConversationType.USER_MULTICHAT)
        chat.participants = request.body['participants']
        chat.save()

        MessageModel.objects.create(
            sent_by_id=request.user.id,
            in_conversation_id=chat.id,
            content=request.body['message']['content'],
        )

        return self.created({'id': chat.id})


class Chat(ApiBase, View):
    @json_request
    @uri_resource('chat', of_type=ConversationModel)
    @request_parameter('name', of_type=types.chat_name)
    @permissions_required_for('chat')
    def put(self, request, chat):
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
            404:
                description: the chat does not exist
        ...

        :type request: HttpRequest
        :type chat: ConversationModel
        """

        chat.name = request.body['name']
        chat.save()

        return self.success(serializers.conversation(chat))


class ChatMessages(ApiBase, View):
    @json_request
    @uri_resource('chat', of_type=ConversationModel)
    @request_parameter('content', of_type=types.message_content)
    @permissions_required_for('chat')
    def post(self, request, chat):
        """ Send a new message in given chat
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chat
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
                      content:
                          type: string
                          example: Hi Peter, how are you?
                          description: Content, e.g. utf8-formatted plain text
        responses:
            201:
                description: Chat message added
                schema:
                    id: message
                    type: object
                    required:
                      - content
                      - sender
                      - created_at
                      - id
                    properties:
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
            404:
                description: the chat does not exist
        ...

        :type request: HttpRequest
        :type chat: ConversationModel
        """

        message = MessageModel.objects.create(
            sent_by_id=request.user.id,
            in_conversation_id=chat.id,
            content=request.body['content'],
        )

        serialized_message = serializers.conversation_message(message)
        payload = {'chat_id': chat.id, 'message': serialized_message}
        RealtimeClientData.send_to_users(list(chat.participants.values_list('id', flat=True)),
                                         RealtimeClientData.Types.CHAT_MESSAGE,
                                         payload)

        return self.created(serialized_message)

    @uri_resource('chat', of_type=ConversationModel)
    @permissions_required_for('chat')
    def get(self, request, chat):
        """Retrieve all the messages in the given chat, sorted descending by time (most recent first).
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chat
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
            404:
                description: the chat does not exist
        ...

        :type request: HttpRequest
        :type chat: ConversationModel
        """

        messages = MessageModel.objects \
            .filter(in_conversation=chat.id) \
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

        return self.success({'messages': [serializers.conversation_message(message) for message in messages]})


class ChatParticipants(ApiBase, View):
    @json_request
    @uri_resource('chat', of_type=ConversationModel)
    @request_parameter('users', of_type=types.list_of_userids)
    @permissions_required_for('chat')
    @rollback_on(IntegrityError, reason='A supplied user does not exist')
    def post(self, request, chat):
        """Add a list of users to the chat.
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chat
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
            404:
                description: The chat does not exist
        ...

        :type request: HttpRequest
        :type chat: ConversationModel
        """

        chat.participants.add(*request.body['users'])

        return self.created()


class ChatParticipant(ApiBase, View):
    @uri_resource('chat', of_type=ConversationModel)
    @uri_resource('user', of_type=UserModel)
    @permissions_required_for('chat')
    def delete(self, request, chat, user):
        """Remove a user from the chat.
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: chat
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
            404:
                description: the chat does not exist or the user does not exist
        ...

        :type request: HttpRequest
        :type chat: ConversationModel
        :type user: UserModel
        """

        chat.participants.remove(user)

        return self.deleted()

urlpatterns = [
    url(r'^$', Chats.as_view()),
    url(r'^{chat}/?$'.format(chat=chat_id_uri_pattern), Chat.as_view()),
    url(r'^{chat}/messages/?$'.format(chat=chat_id_uri_pattern), ChatMessages.as_view()),
    url(r'^{chat}/participants/?$'.format(chat=chat_id_uri_pattern), ChatParticipants.as_view()),
    url(r'^{chat}/participants/{user}/?$'.format(chat=chat_id_uri_pattern, user=user_id_uri_pattern), ChatParticipant.as_view()),
]
