from django.conf.urls import url
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.http import HttpRequest

from django.views.generic import View

from yunity.api.ids import group_id_uri_pattern
from yunity.api import types, serializers
from yunity.utils.api.abc import ApiBase
from yunity.utils.api.decorators import json_request, request_parameter, uri_resource, permissions_required_for, \
    login_required, rollback_on
from yunity.models.concrete import Group as GroupModel, GroupMembership as GroupMembershipModel


class Groups(ApiBase, View):
    def get(self, request):
        """List all groups.
        ---
        tags:
            - Group
        responses:
            200:
                description: A list of all the available groups
                schema:
                    type: object
                    required:
                      - groups
                    properties:
                        groups:
                            type: array
                            items:
                                type: object
                                properties:
                                    id:
                                        type: number
                                        description: id of the group
                                        example: 1
                                    name:
                                        type: string
                                        description: name of the group
                                        example: moonhowlers
                                    description:
                                        type: string
                                        description: description of the group
                                        example: A group of people who love to howl at the moon
        ...

        :type request: HttpRequest

        """
        groups = GroupModel.objects.all()

        return self.success({'groups': [serializers.group_summary(group) for group in groups]})

    @json_request
    @login_required
    @request_parameter('name', of_type=types.group_name)
    @request_parameter('description', of_type=types.group_description)
    def post(self, request):
        """Create a new group
        ---
        tags:
            - Group
        parameters:
            -   in: body
                name: body
                schema:
                    id: create_group
                    required:
                        - name
                        - description
                    properties:
                        name:
                            type: string
                            description: name of the group
                            example: moonhowlers
                        description:
                            type: string
                            description: description of the group
                            example: A group of people who love to howl at the moon
        responses:
            201:
                description: Group created
                schema:
                    id: group_information
                    type: object
                    required:
                        - id
                        - name
                        - description
                    properties:
                        id:
                            type: number
                            description: id of the group
                            example: 1
                        name:
                            type: string
                            description: name of the group
                            example: moonhowlers
                        description:
                            type: string
                            description: description of the group
                            example: A group of people who love to howl at the moon
                        members:
                            type: array
                            description: List of members in the group
                            items:
                                $ref: '#/definitions/user_information_response'


            403:
                description: Insufficient rights to create this item
                schema:
                    $ref: '#/definitions/result_error_forbidden'
        ...


        :type request: HttpRequest
        :rtype JsonResponse

        """

        group = GroupModel.objects.create(
            name=request.body['name'],
            description=request.body['description'],
        )

        membership = GroupMembershipModel.objects.create(
            user=request.user,
            group=group,
        )

        return self.created(serializers.group(group))


class GroupMembers(ApiBase, View):
    @json_request
    @uri_resource('group', of_type=GroupModel)
    @request_parameter('users', of_type=types.list_of_userids)
    @permissions_required_for('group')
    @rollback_on(IntegrityError, reason='A supplied user does not exist')
    def post(self, request, group):
        """Add a list of users to the group.
        ---
        tags:
            - Group
        parameters:
            - in: path
              name: group
              description: ID of group
              type: integer
            - in: body
              name: body
              schema:
                  id: groupusers
                  required:
                      - users
                  properties:
                      users:
                          type: array
                          description: List of users to add to this specific group.
                          example: [1, 5, 8]
                          items:
                              type: number
        responses:
            201:
                description: All users added
            400:
                description: At least one user does not exist, none added
            403:
                description: The user does not have the rights to add participants to the group
            404:
                description: The group does not exist
        ...

        :type request: HttpRequest
        :type chat: ConversationModel
        """

        for user in request.body['users']:
            user = get_user_model().objects.get(id=user)
            GroupMembershipModel.objects.create(user=user, group=group)

        return self.created()

class Group(ApiBase, View):
    @uri_resource('group', of_type=GroupModel, max_resources=1)
    def get(self, request, group):
        """Get details for a group
        ---
        tags:
            - Group
        parameters:
            - in: path
              name: group
              description: id of group
              type: integer
        responses:
            200:
                description: Details for a specific group
                schema:
                    $ref: '#/definitions/group_information'
        ...

        :type request: HttpRequest

        """
        return self.success(serializers.group(group))


urlpatterns = [
    url(r'^$', Groups.as_view()),
    url(r'^{group}/?$'.format(group=group_id_uri_pattern), Group.as_view()),
    url(r'^{group}/members/?$'.format(group=group_id_uri_pattern), GroupMembers.as_view()),
]