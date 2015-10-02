
from django.conf.urls import include, url
from rest_framework.routers import DefaultRouter

import yunity.views.auth
from yunity.views.rest.auth import AuthViewSet
from yunity.views.rest.category import CategoryViewSet
from yunity.views.rest.chat import ChatViewSet
from yunity.views.rest.feedback import FeedbackViewSet
from yunity.views.rest.mapitem import MapitemViewSet
from yunity.views.rest.search import SearchViewSet
from yunity.views.rest.user import UserViewSet

router = DefaultRouter()
router.register(r'chat', ChatViewSet)
router.register(r'user', UserViewSet)
router.register(r'auth', AuthViewSet)
router.register(r'mapitem', MapitemViewSet)
router.register(r'search', SearchViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'category', CategoryViewSet)


urlpatterns = [
    url(r'^auth-builtin/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r'^login/$', yunity.views.auth.LoginView.as_view()),
    # url(r'^register/$', yunity.views.auth.RegisterView.as_view()),
    # url(r'^mappables/new/$', yunity.views.mappable.CreateMappableView.as_view()),
    # url(r'^mappables/(?P<mappable_id>[0-9]+)$', yunity.views.mappable.GetMappableView.as_view()),
    # url(r'^search/mappables/$', yunity.views.search.SearchMappableView.as_view()),
    # url(r'^chat/$', yunity.views.chat.NewChat.as_view()),
    # url(r'^chat/(?P<chatid>[0-9]+)/$', yunity.views.chat.Chat.as_view()),
    # url(r'^chat/(?P<chatid>[0-9]+)/messages/$', yunity.views.chat.ChatMessages.as_view()),
    # url(r'^chat_demo/(?P<chatid>[0-9]+)$', yunity.views.chat.chat_demo), # will be removed
] + router.urls
