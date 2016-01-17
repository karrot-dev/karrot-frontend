from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

from yunity.api import types, serializers
from yunity.api.ids import item_id_uri_pattern
from yunity.base.other_models import Item as ItemModel
from yunity.utils.api.abc import ApiBase
from yunity.utils.api.decorators import json_request, request_parameter, uri_resource, login_required


class Items(ApiBase, View):
    def get(self, request):
        """List all items available.
        ---
        tags:
            - Item
        responses:
            200:
                description: A list of all the items available
                schema:
                    type: object
                    required:
                      - items
                    properties:
                        items:
                            type: array
                            items:
                                $ref: '#/definitions/item_information'
        ...

        :type request: HttpRequest

        """
        items = ItemModel.objects.all()

        return self.success({'items': [serializers.item(item) for item in items]})

    @login_required
    @json_request
    @request_parameter('description', of_type=types.item_description)
    @request_parameter('latitude', of_type=types.latitude)
    @request_parameter('longitude', of_type=types.longitude)
    def post(self, request):
        """Create a new item
        ---
        tags:
            - Item
        parameters:
            - in: body
              name: body
              schema:
                  id: create_item
                  required:
                    - description
                    - latitude
                    - longitude
                  properties:
                      description:
                          type: string
                          description: description of item
                          example: Some lovely bananas, and a bit of stale old bread too
                      latitude:
                          type: float
                          description: latitude of item location
                          example: 50.827845
                      longitude:
                          type: float
                          description: longitude of item location
                          example: 12.921370
        responses:
            201:
                description: Item created
                schema:
                    id: item_information
                    type: object
                    required:
                      - id
                      - user_id
                      - description
                    properties:
                        id:
                            type: number
                            description: Identifier of the item
                            example: 1
                        user_id:
                            type: number
                            description: User id for the owner of the item
                            example: 1
                        description:
                            type: string
                            example: A box of mouldy apples full of worms, and a couple of squashed tomatoes too
                            description: Description of the item
                        latitude:
                            type: float
                            description: latitude of item location
                            example: 50.827845
                        longitude:
                            type: float
                            description: longitude of item location
                            example: 12.921370

            403:
                description: Insufficient rights to create this item
                schema:
                    $ref: '#/definitions/result_error_forbidden'
            400:
                description: Invalid parameter in request
                schema:
                    $ref: '#/definitions/result_error_forbidden'
        ...


        :type request: HttpRequest
        :rtype JsonResponse

        """

        item = ItemModel.objects.create(
            user_id=request.user.id,
            description=request.body['description'],
            latitude=request.body['latitude'],
            longitude=request.body['longitude']
        )

        return self.created(serializers.item(item))


class Item(ApiBase, View):
    @uri_resource('item', of_type=ItemModel, max_resources=1)
    def get(self, request, item):
        """Get details for an item
        ---
        tags:
            - Item
        parameters:
            - in: path
              name: item
              description: id of item
              type: integer
        responses:
            200:
                description: Details for a specific item
                schema:
                    $ref: '#/definitions/item_information'
        ...

        :type request: HttpRequest

        """
        return self.success(serializers.item(item))

urlpatterns = [
    url(r'^$', Items.as_view()),
    url(r'^{item}/?$'.format(item=item_id_uri_pattern), Item.as_view()),
]
