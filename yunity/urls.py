
from django.conf.urls import include, url
from django.contrib.auth import views as auth_views

import yunity.views.auth
import yunity.views.chat
import yunity.views.mappable
import yunity.views.search


urlpatterns = [
    url(r'^login/$', auth_views.login, {'template_name': 'login.html'}),
    url(r'^register/$', yunity.views.auth.RegisterView.as_view()),
    url(r'^mappables/new/$', yunity.views.mappable.CreateMappableView.as_view()),
    url(r'^mappables/(?P<mappable_id>[0-9]+)$', yunity.views.mappable.GetMappableView.as_view()),
    url(r'^search/mappables/$', yunity.views.search.SearchMappableView.as_view()),
    url(r'^chat/$', yunity.views.chat.NewChat.as_view()),
    url(r'^chat/(?P<chatid>[0-9]+)/$', yunity.views.chat.Chat.as_view()),
    url(r'^chat/(?P<chatid>[0-9]+)/messages/$', yunity.views.chat.ChatMessages.as_view()),
    url(r'^chat_demo/(?P<chatid>[0-9]+)$', yunity.views.chat.chat_demo), # will be removed
]
