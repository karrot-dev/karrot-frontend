from django.conf.urls import url
from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.datetime_safe import datetime
from django.views.generic import View

from yunity.api.ids import user_id_uri_pattern, multiple_user_id_uri_pattern
from yunity.utils.api import ApiBase, body_as_json
from yunity.models import Category as CategoryModel


class UserAll(ApiBase, View):
    @body_as_json(expected_keys=['email', 'password', 'name'])
    def post(self, request):
        """register a new user

        :type request: HttpRequest
        """
        category = CategoryModel.objects.get(name='user.default')

        user = get_user_model().objects.create_user(
            email=request.body['email'],
            password=request.body['password'],
            locations='{}',
            type=category,
            display_name=request.body['name'],
            date_joined=datetime.utcnow().isostring()
        )

        return self.created({"id": user.id,
                      "display_name": user.display_name})


class UserMultiple(ApiBase, View):
    def get(self, request, userids):
        """get details about all given users

        :type request: HttpRequest
        :type userids: [int]
        """
        userids = [int(_) for _ in userids.split(",")]
        users = get_user_model().objects\
            .filter(id__in=userids)\
            .values('id', 'display_name', 'picture_url')\
            .all()
        if len(users) != len(userids):
            return self.error({"reason": "one or more userids do not exist"})

        return self.success({"users": [dict(_) for _ in users]})

class UserSingle(ApiBase, View):
    def put(self, request, userid):
        """modify the user

        :type request: HttpRequest
        :type userid: int
        """
        raise NotImplementedError


urlpatterns = [
    url(r'^$', UserAll.as_view()),
    url(r'^{userid}/?$'.format(userid=multiple_user_id_uri_pattern), UserMultiple.as_view()),
    url(r'^{userid}/?$'.format(userid=user_id_uri_pattern), UserSingle.as_view()),
]
