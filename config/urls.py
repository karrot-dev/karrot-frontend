"""yunity URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin

from rest_framework_nested import routers
from yunity.api.public.auth import AuthViewSet
from yunity.api.public.chats import ChatViewSet, ChatMessageViewSet
from yunity.api.public.groups import GroupViewSet
from yunity.api.public.users import UserViewSet, UserChatViewSet

router = routers.DefaultRouter()

router.register(r'group', GroupViewSet)
router.register(r'auth', AuthViewSet, base_name='auth')

# User endpoints
router.register(r'user', UserViewSet)
user_router = routers.NestedSimpleRouter(router, r'user', lookup='user')
user_router.register(r'chat', UserChatViewSet, base_name='user-chat')

# Chat endpoints
router.register(r'chat', ChatViewSet)
chat_router = routers.NestedSimpleRouter(router, r'chat', lookup='chat')
chat_router.register(r'messages', ChatMessageViewSet, base_name='chat-messages')

urlpatterns = [
    url(r'^api/', include(router.urls, namespace='api')),
    url(r'^api/', include(user_router.urls, namespace='api')),
    url(r'^api/', include(chat_router.urls, namespace='api')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', include('rest_framework_swagger.urls')),
]
