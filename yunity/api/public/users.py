from django.conf.urls import url
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.ids import user_id_uri_pattern, multiple_user_id_uri_pattern
from yunity.api import types, serializers
from yunity.resources.http.status import HTTP_409_CONFLICT
from yunity.utils.api.abc import ApiBase
from yunity.utils.api.decorators import json_request, request_parameter, uri_resource, permissions_required_for, \
    rollback_on


class UserAll(ApiBase, View):
    @json_request
    @request_parameter('email', of_type=types.user_email)
    @request_parameter('password', of_type=types.user_password)
    @request_parameter('display_name', of_type=types.user_display_name)
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
        )

        return self.created(serializers.user(user))


class UserMultiple(ApiBase, View):
    @uri_resource('users', of_type=get_user_model())
    def get(self, request, users):
        """get details about all given users
        ---
        tags:
            - User
        parameters:
            - in: path
              name: userids
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


class UserSingle(ApiBase, View):
    @json_request
    @uri_resource('user', of_type=get_user_model())
    @request_parameter('display_name', of_type=types.user_display_name)
    @permissions_required_for('user')
    def put(self, request, user):
        """Modify a user: Yourself or any user you have sufficient rights for.
        Only the provided fields will be changed. To clear fields, set them explicitly as empty.
        ---
        tags:
            - User
        parameters:
            - in: path
              name: userid
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
        :type user: UserModel
        """

        user.display_name = request.body['display_name']
        user.save()

        return self.created(serializers.user(user))


urlpatterns = [
    url(r'^$', UserAll.as_view()),
    url(r'^{user}/?$'.format(user=user_id_uri_pattern), UserSingle.as_view()),
    url(r'^{users}/?$'.format(users=multiple_user_id_uri_pattern), UserMultiple.as_view()),
]
