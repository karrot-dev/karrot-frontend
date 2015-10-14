from django.conf.urls import url
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token as generate_csrf_token_for_frontend
from django.views.generic import View

from yunity.api import types, serializers
from yunity.utils.session import RealtimeClientData
from yunity.utils.api.abc import ApiBase
from yunity.utils.api.decorators import json_request, request_parameter


class Login(ApiBase, View):
    def get(self, request):
        """get current login status.
        Also generates a CSRF cookie which has to be used for further requests.
        ---
        tags:
            - Authentication
        responses:
            200:
                description: Login state with an empty user if not logged in
                schema:
                    id: user_login_response
                    type: object
                    properties:
                        user:
                            $ref: '#/definitions/user_information_response'
        ...

        :type request: HttpRequest
        """
        generate_csrf_token_for_frontend(request)
        return self.success({'user': serializers.user(request.user)})

    @json_request
    @request_parameter('email', of_type=types.user_email)
    @request_parameter('password', of_type=types.user_password)
    def post(self, request):
        """Logs in the user using the provided credentials
        ---
        tags:
            - Authentication
        parameters:
            - in: body
              name: body
              schema:
                  id: User
                  required:
                      - email
                      - password
                  properties:
                      email:
                          type: string
                          description: email for user
                      password:
                          type: string
                          description: password of user
        responses:
            200:
                description: Login state
                schema:
                    $ref: '#/definitions/user_login_response'
            403:
                description: User credentials wrong
        ...

        :type request: HttpRequest
        """
        user = authenticate(email=request.body['email'], password=request.body['password'])
        if user is None:
            return self.forbidden(reason='wrong login credentials.')

        login(request, user)
        return self.success({'user': user_to_dict(user)})


class Logout(ApiBase, View):
    def post(self, request):
        """log out the user
        ---
        tags:
          - Authentication
        responses:
            200:
                description: User logged out
        ...

        :type request: HttpRequest
        """
        RealtimeClientData.destroy_user_session(request.session.session_key)
        logout(request)
        return self.success()


urlpatterns = [
    url(r'^/login$', Login.as_view()),
    url(r'^/logout$', Logout.as_view()),
]
