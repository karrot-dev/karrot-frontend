from django.conf.urls import url
from django.db.models import Q
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.ids import chat_id_uri_pattern, user_id_uri_pattern
from yunity.api.validation import validate_chat_message, validate_chat_participants, validate_chat_name, \
    validate_chat_message_type, validate_chat_message_content, validate_chat_users
from yunity.utils.api.abc import ApiBase, body_as_json
from yunity.utils.api.request import Parameter
from yunity.utils.api.misc import model_to_json
from yunity.models.concrete import Chat as ChatModel
from yunity.models.concrete import Message as MessageModel
from yunity.models.concrete import User as UserModel
from yunity.utils.query import Json_agg


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
            .filter(participants=request.user.id) \
            .values('id')
        chat_values = ChatModel.objects.filter(id__in=chats)\
            .order_by('id')\
            .annotate(all_participants=Json_agg('participants'))\
            .values(
                'id', 'all_participants', 'name'
            )
        messages = MessageModel.objects.filter(in_conversation__in=chats)\
            .order_by('in_conversation','-created_at')\
            .distinct('in_conversation')\
            .values('in_conversation','created_at','id','content','type','sent_by_id')
        messages = list(messages)
        messages.sort(key=lambda x: x['created_at'], reverse=True)

        message_dict = []
        for m in messages:
            cv = chat_values.get(id=m['in_conversation'])
            o = {"participants": cv['all_participants'],
                 "name": cv['name'],
                 "message": {
                     "id": m['id'],
                     "content": m['content'],
                     "type": m['type'],
                     "sender": m['sent_by_id'],
                     "created_at": m['created_at'].isoformat()
                    },
                 "id": m['in_conversation']}
            message_dict.append(o)


        return self.success({'chats': message_dict})

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
                description: The logged in user is not part of the conversation
        ...


        :type request: HttpRequest
        :rtype JsonResponse

        """
        participant_ids = request.body['participants']
        chat = chat_from(participant_ids)

        message = request.body['message']

        type_str = message['type']
        if type_str not in ['TEXT', 'IMAGE']:
            return self.error(reason='invalid type')
        content = message['content']

        message = MessageModel.objects.create(
            sent_by_id=request.user.id,
            in_conversation_id=chat.id,
            type=type_str,
            content=content,
        )
        return self.created({'id': chat.id})


class Chat(ApiBase, View):
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
        ...

        :type request: HttpRequest
        :type chatid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')
        chat_name = request.body['name']
        chat = ChatModel.objects.get(id=chatid)
        chat.name = chat_name

        return self.success({'name': chat.name})


class ChatMessages(ApiBase, View):
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
        ...

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')
        type_str = request.body['type']
        if type_str not in ['TEXT', 'IMAGE']:
            return self.error(reason='invalid type')
        content = request.body['content']
        senderid = request.user.id

        message = MessageModel.objects.create(
            sent_by=senderid,
            in_conversation_id=chatid,
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
                    required:
                      - messages
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
            return self.forbidden(reason='user does not have rights to chat')

        if request.GET['take'] or request.GET['before_id']:
            return NotImplemented

        messages = MessageModel.objects \
            .filter(in_conversation=chatid) \
            .reverse() \
            .all()

        return self.success({'messages': [message_to_json(_) for _ in messages]})


class ChatParticipants(ApiBase, View):
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
            return self.forbidden(reason='user does not have rights to chat')

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
            201:
                description: Participant deleted
            403:
                description: The logged in user is not part of the conversation
        ...

        :type request: HttpRequest
        :type chatid: int
        :type userid: int

        """
        if not user_has_rights_to_chat(chatid, request.user.id):
            return self.forbidden(reason='user does not have rights to chat')

        ChatModel.objects \
            .get(id=chatid) \
            .filter(participants=userid) \
            .delete()

        return self.success()

urlpatterns = [
    url(r'^$', Chats.as_view()),
    url(r'/^{chatid}/?$'.format(chatid=chat_id_uri_pattern), Chat.as_view()),
    url(r'/^{chatid}/messages/?$'.format(chatid=chat_id_uri_pattern), ChatMessages.as_view()),
    url(r'/^{chatid}/participants/?$'.format(chatid=chat_id_uri_pattern), ChatParticipants.as_view()),
    url(r'/^{chatid}/participants/{userid}/?$'.format(chatid=chat_id_uri_pattern, userid=user_id_uri_pattern),
        ChatParticipant.as_view()),
]
