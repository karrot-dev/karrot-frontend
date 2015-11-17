from django.conf.urls import include
from django.conf.urls import url

import yunity.api.public.auth
import yunity.api.public.chats
import yunity.api.public.users
import yunity.api.public.items


urlpatterns = [
    url(r'^auth', include(yunity.api.public.auth)),
    url(r'^chats/?', include(yunity.api.public.chats)),
    url(r'^users/?', include(yunity.api.public.users)),
    url(r'^items/?', include(yunity.api.public.items)),
]
