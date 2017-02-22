"""URL Configuration

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
from rest_framework_swagger.views import get_swagger_view

from foodsaving.history.api import HistoryViewSet
from foodsaving.userauth.api import AuthViewSet
from foodsaving.conversations.api import ChatViewSet, ChatMessageViewSet
from foodsaving.groups.api import GroupViewSet
from foodsaving.stores.api import StoreViewSet, PickupDateViewSet, PickupDateSeriesViewSet
from foodsaving.users.api import UserViewSet

router = routers.DefaultRouter()

router.register(r'groups', GroupViewSet)
router.register(r'auth', AuthViewSet, base_name='auth')

# User endpoints
router.register(r'users', UserViewSet)

# Chat endpoints
router.register(r'conversations', ChatViewSet)
chat_router = routers.NestedSimpleRouter(router, r'conversations', lookup='conversations')
chat_router.register(r'messages', ChatMessageViewSet, base_name='conversations-messages')

# pickup date endpoints
router.register(r'pickup-date-series', PickupDateSeriesViewSet)
router.register(r'pickup-dates', PickupDateViewSet)

# Store endpoints
router.register(r'stores', StoreViewSet)

# History endpoints
router.register('history', HistoryViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls, namespace='api')),
    url(r'^api/', include(chat_router.urls, namespace='api')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', get_swagger_view()),
]
