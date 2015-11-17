from django.conf.urls import url
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.db.models import Count
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.ids import user_id_uri_pattern, multiple_user_id_uri_pattern
from yunity.api import types, serializers
from yunity.models import Conversation as ConversationModel
from yunity.resources.http.status import HTTP_409_CONFLICT
from yunity.utils.api.abc import ApiBase
from yunity.utils.api.decorators import json_request, request_parameter, uri_resource, permissions_required_for, \
    rollback_on, login_required


class Users(ApiBase, View):
    @json_request
    @request_parameter('email', of_type=types.user_email)
    @request_parameter('password', of_type=types.user_password)
    @request_parameter('display_name', of_type=types.user_display_name, optional=True)
    @request_parameter('first_name', of_type=types.user_first_name)
    @request_parameter('last_name', of_type=types.user_last_name)
    @rollback_on(IntegrityError, reason='user already exists', status=HTTP_409_CONFLICT)
    def post(self, request):
        """register a new user
        ---
        tags:
            - User
        parameters:
            - in: body
              name: body
              schema:
                  id: create_user
                  required:
                    - email
                    - password
                    - first_name
                    - last_name
                  properties:
                      email:
                          type: string
                          description: email address of new user
                          example: paul@example.com
                      password:
                          type: string
                          description: Password for user. Will be validated to specific rules
                          example: PaulsStrongPasswordWhichHeNeverForgets
                      last_name:
                          type: string
                          example: Webber
                          description: The last name
                      first_name:
                          type: string
                          example: Paul
                          description: The first name
                      display_name:
                          type: string
                          example: Paul
                          description: The public displayed name, defaults to first_name if not specified
        responses:
            201:
                description: User created
                schema:
                  id: user_information_response
                  allOf:
                          - $ref: '#/definitions/user_information'
                          - type: object
                            required:
                              - id
                            properties:
                              id:
                                type: number
                                description: Identifier of the User
                                example: 3
            409:
                description: That emailaddress is already registered
        ...

        :type request: HttpRequest
        """

        user = get_user_model().objects.create_user(
            email=request.body['email'],
            password=request.body['password'],
            display_name=request.body['display_name'],
            first_name=request.body['first_name'],
            last_name=request.body['last_name'],
        )

        return self.created(serializers.user(user))


class User(ApiBase, View):
    @uri_resource('users', of_type=get_user_model(), max_resources=None)
    def get(self, request, users):
        """get details about all given users
        ---
        tags:
            - User
        parameters:
            - in: path
              name: users
              type: array
              collectionFormat: csv
              items:
                  type: integer

        responses:
            201:
                description: User information
                schema:
                    type: object
                    properties:
                      users:
                        type: array
                        items:
                            $ref: '#/definitions/user_information_response'
            404:
                description: one or more users do not exist
        ...

        :type request: HttpRequest
        :type users: [UserModel]
        """

        return self.success({"users": [serializers.user(user) for user in users]})

    @json_request
    @uri_resource('users', of_type=get_user_model())
    @request_parameter('display_name', of_type=types.user_display_name, optional=True)
    @request_parameter('first_name', of_type=types.user_first_name, optional=True)
    @request_parameter('last_name', of_type=types.user_last_name, optional=True)
    @permissions_required_for('users')
    def put(self, request, users):
        """Modify a user: Yourself or any user you have sufficient rights for.
        Only the provided fields will be changed. To clear fields, set them explicitly as empty.
        ---
        tags:
            - User
        parameters:
            - in: path
              name: users
              type: integer
            - in: body
              name: body
              required: true
              schema:
                  id: user_information
                  properties:
                      last_name:
                          type: string
                          example: Webber
                          description: The last name
                      first_name:
                          type: string
                          example: Paul
                          description: The first name
                      display_name:
                          type: string
                          example: Paul
                          description: The public displayed name, defaults to first_name if not specified

        responses:
            201:
                description: User information
                schema:
                    $ref: '#/definitions/user_information_response'
            403:
                description: You are not allowed to modify that user
            404:
                description: the user does not exist
        ...

        :type request: HttpRequest
        :type users: UserModel
        """

        if 'display_name' in request.body:
            users.display_name = request.body['display_name']
        if 'first_name' in request.body:
            users.first_name = request.body['first_name']
        if 'last_name' in request.body:
            users.last_name = request.body['last_name']
        users.save()

        return self.created(serializers.user(users))


class UserChat(ApiBase, View):
    @uri_resource('user', of_type=get_user_model())
    @login_required
    def post(self, request, user):
        """get the chat between the logged in and the given user.
        ---
        tags:
            - Chat
        parameters:
            - in: path
              name: user
              type: integer

        responses:
            201:
                description: Chat information
                schema:
                    type: object
                    properties:
                      chat:
                        $ref: '#/definitions/chat_information'
            404:
                description: The user does not exist
        ...

        :type request: HttpRequest
        :type user: [UserModel]
        """

        participants = [request.user.id, user.id]
        chat = ConversationModel.objects.filter(participants__id__in=participants).annotate(c=Count('participants')).filter(c=2).first()
        if not chat:
            chat = ConversationModel.objects.create()
            chat.participants = participants
            chat.save()

        return self.created({"chat": serializers.conversation(chat)})


urlpatterns = [
    url(r'^$', Users.as_view()),
    url(r'^{users}/?$'.format(users=multiple_user_id_uri_pattern), User.as_view()),
    url(r'^{user}/chat/?$'.format(user=user_id_uri_pattern), UserChat.as_view()),
]
