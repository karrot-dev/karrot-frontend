from django.conf.urls import url
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.views.generic import View

from yunity.api.validation import validate_user_email
from yunity.api.validation import validate_user_password
from yunity.utils.session import RealtimeClientData
from yunity.utils.api.abc import ApiBase, body_as_json
from yunity.utils.request import Parameter


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
        # force a CSRF token to be generated for the frontend to use
        get_token(request)
        if request.user.is_authenticated():
            return self.success({'user': {'id': request.user.id, 'display_name': request.user.display_name}})
        else:
            return self.success({'user': {}})

    @body_as_json(parameters=[
        Parameter(name='email', validator=validate_user_email),
        Parameter(name='password', validator=validate_user_password),
    ])
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
            return self.forbidden(reason="wrong login credentials.")

        login(request, user)
        return self.success({
            'user': {
                'id': user.id,
                'display_name': user.display_name,
            },
        })


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
