
from django.conf.urls import include, url

import yunity.views.auth
import yunity.views.chat
import yunity.views.mappable
import yunity.views.search


urlpatterns = [
    url(r'^login/$', yunity.views.auth.LoginView.as_view()),
    url(r'^register/$', yunity.views.auth.RegisterView.as_view()),
    url(r'^mappables/new/$', yunity.views.mappable.CreateMappableView.as_view()),
    url(r'^mappables/(?P<mappable_id>[0-9]+)$', yunity.views.mappable.GetMappableView.as_view()),
    url(r'^search/mappables/$', yunity.views.search.SearchMappableView.as_view()),
    url(r'^search/mappables/locations/$', yunity.views.search.SearchMappableLocationsView.as_view()),
    url(r'^msg/$', yunity.views.chat.ChatView.as_view()),
    url(r'^msg_demo/(?P<chatid>[0-9]+)/$', yunity.views.chat.chat_demo), # will be removed
]
