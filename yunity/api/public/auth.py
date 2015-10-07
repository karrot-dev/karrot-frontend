from django.conf.urls import url
from django.contrib.auth import authenticate, login, logout
from django.views.generic import View

from yunity.utils.session import RealtimeClientData
from yunity.utils.api import ApiBase, body_as_json
import yunity.utils.status


class Login(ApiBase, View):
    def get(self, request):
        """get current login status
        ---
        tags:
            - Authentication
        responses:
            200:
                description: Login state
                schema:
                    id: user_login_response
                    type: object
                    required:
                      - user
                    properties:
                        user:
                            $ref: '#/definitions/user_information_response'
            404:
                description: User is not logged in
        ...

        :type request: HttpRequest
        """
        if request.user.is_authenticated():
            return self.success({'user': {'id': request.user.id, 'name': request.user.name}})
        else:
            return self.error('User not logged in.')

    @body_as_json(expected_keys=['email', 'password'])
    def post(self, request, data):
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
        user = authenticate(email=data['email'], password=data['password'])
        if user is not None:
            login(request, user)
            return self.success({'user': {'id': request.user.id, 'name': request.user.name}})
        else:
            return self.forbidden(reason="wrong login credentials.")


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
