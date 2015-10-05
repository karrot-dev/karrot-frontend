from django.conf.urls import url
from django.db.models import Max, Q
from django.http import HttpRequest
from django.utils.datetime_safe import datetime
from django.views.generic import View
from yunity.api.ids import chat_id_uri_pattern, user_id_uri_pattern

from yunity.api.utils import ApiBase, model_to_json, body_as_json
from yunity.models.concrete import Chat as ChatModel
from yunity.models.concrete import Message as MessageModel
from yunity.models.concrete import User as UserModel


def user_to_json(user):
    return model_to_json(user, 'id')


def message_to_json(message):
    return model_to_json(message, 'sender', 'created_at', 'type', 'content')


def chat_to_json(chat):
    return model_to_json(chat, 'id')


def chat_from(userids):
    participants = UserModel.objects \
        .filter(id__in=userids) \
        .all()
    chat = ChatModel.objects.create()
    chat.participants = participants
    return chat


def user_has_rights_to_chat(chatid, userid):
    return ChatModel.objects \
        .filter(id=chatid) \
        .filter(Q(participants=userid) | Q(administrated_by=userid)) \
        .exists()


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
                    properties:
                        chats:
                            type: array
                            items:
                                $ref: '#/definitions/chat'
        ...

        :type request: HttpRequest

        """
        chats = ChatModel.objects \
            .filter(participants=request.user.id) \
            .annotate(most_recent_message=Max('messages__created_at')) \
            .order_by('-most_recent_message') \
            .values('id')

        return self.success({'chats': [chat_to_json(_) for _ in chats]})

    @body_as_json(expected_keys=['participants', 'message'])
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
                    id: chat
                    type: object
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
                description: The logged in user is not part of the conversation
        ...


        :type request: HttpRequest
        :rtype JsonResponse

        """
        participant_ids = request.body['participants']
        if request.user.id not in participant_ids:
            return self.forbidden("User can only create chat including self")
        chat = chat_from(participant_ids)
        return self.created({'id': chat.id})


class Chat(ApiBase, View):
    @body_as_json(expected_keys=['name'])
    def put(self, request, chatid):
        """Update details about chat chatid

        :type request: HttpRequest
        :type chatid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden('user does not have rights to chat')
        chat_name = request.body['name']
        chat = ChatModel.objects.get(id=chatid)
        chat.name = chat_name

        return self.success({'name': chat.name})


class ChatMessages(ApiBase, View):
    @body_as_json(expected_keys=['type', 'content'])
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
                    properties:
                        typ:
                            type: string
                            enum: [TEXT, IMAGE]
                            description: Type of this message
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
        ...

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden('user does not have rights to chat')
        type_str = request.body['type']
        if type_str not in ['TEXT', 'IMAGE']:
            return self.error('invalid type')
        content = request.body['content']
        sender = UserModel.objects.get(id=request.user.id)
        created_at = datetime.datetime.now()

        chat = ChatModel.objects.get(id=chatid)
        message = MessageModel.objects.create(
            sent_by=sender,
            in_conversation=chat,
            created_at=created_at,
            type=type_str,
            content=content,
        )

        return self.success(message_to_json(message))

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
            201:
                description: Result message set
                schema:
                    id: result_messages
                    type: object
                    properties:
                        messages:
                            type: array
                            items:
                                $ref: '#/definitions/message'

            403:
                description: The logged in user is not part of the conversation
        ...


        :type request: HttpRequest
        :type chatid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden('user does not have rights to chat')

        messages = MessageModel.objects \
            .filter(in_conversation=chatid) \
            .reverse() \
            .all()

        return self.success({'messages': [message_to_json(_) for _ in messages]})


class ChatParticipants(ApiBase, View):
    @body_as_json(expected_keys=['users'])
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
        ...

        request_json:
            users:
                type: list
                required: true
                description: a list of ids of users to remove

        :type request: HttpRequest
        :type chatid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden('user does not have rights to chat')

        users_to_add = UserModel.objects \
            .filter(id=request.body['users']) \
            .all()

        ChatModel.objects \
            .get(id=chatid) \
            .participants \
            .add(users_to_add)

        return self.success()


class ChatParticipant(ApiBase, View):
    def delete(self, request, chatid, userid):
        """Remove a user from the chat.

        url_parameter:
            userid:
                type: integer
                required: true
                description: the id of the user to remove

        :type request: HttpRequest
        :type chatid: int
        :type userid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden('user does not have rights to chat')

        ChatModel.objects \
            .get(id=chatid) \
            .filter(participants=userid) \
            .delete()

        return self.success()

"""
* DELETE /chat/{chatId}/participants/{userId} -- delete a user from the chat
* POST /chat/{chatId}/participants -- add a new user to the chat

* POST /chat/{chatid}/messages -- add a new message to chat

* PUT /chat/{chatid} -- change chat details
* POST /chat/ -- create a new chat with some users
* GET /chat/{chatId}/messages -- return list of messages in chat
* GET /chat/
"""

urlpatterns = [
    url(r'^$', Chats.as_view()),  # GET, POST
    url(r'^{chatid}/?$'.format(chatid=chat_id_uri_pattern), Chat.as_view()),  # PUT
    url(r'^{chatid}/messages/?$'.format(chatid=chat_id_uri_pattern), ChatMessages.as_view()),  # GET, POST
    url(r'^{chatid}/participants/?$'.format(chatid=chat_id_uri_pattern), ChatParticipants.as_view()),  # POST
    url(r'^{chatid}/participants/{userid}/?$'.format(chatid=chat_id_uri_pattern, userid=user_id_uri_pattern), ChatParticipant.as_view()),  # DELETE
]
