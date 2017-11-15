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
from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework_nested import routers
from rest_framework_swagger.views import get_swagger_view

from foodsaving.conversations.api import ConversationMessageViewSet, ConversationViewSet
from foodsaving.groups.api import GroupViewSet, AgreementViewSet, GroupInfoViewSet
from foodsaving.history.api import HistoryViewSet
from foodsaving.invitations.api import InvitationsViewSet, InvitationAcceptViewSet
from foodsaving.stores.api import StoreViewSet, PickupDateViewSet, PickupDateSeriesViewSet, FeedbackViewSet
from foodsaving.subscriptions.api import PushSubscriptionViewSet
from foodsaving.userauth.api import AuthUserView, AuthView, LogoutView, AuthStatusView
from foodsaving.users.api import UserViewSet

router = routers.DefaultRouter()

router.register(r'groups', GroupViewSet)
router.register(r'groups-info', GroupInfoViewSet)
router.register(r'agreements', AgreementViewSet)

# User endpoints
router.register(r'users', UserViewSet)

# pickup date endpoints
router.register(r'pickup-date-series', PickupDateSeriesViewSet)
router.register(r'pickup-dates', PickupDateViewSet)

# Conversation/Message endpoints
router.register(r'conversations', ConversationViewSet)
router.register(r'messages', ConversationMessageViewSet)

# Subscription endpoints
router.register(r'subscriptions/push', PushSubscriptionViewSet)

# Store endpoints
router.register(r'stores', StoreViewSet)

# History endpoints
router.register('history', HistoryViewSet)

# Invitation endpoints
router.register('invitations', InvitationsViewSet)
router.register('invitations', InvitationAcceptViewSet)

# Feedback endpoints
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    url(r'^api/auth/token/$', obtain_auth_token),
    url(r'^api/auth/status/$', AuthStatusView.as_view()),
    url(r'^api/auth/logout/$', LogoutView.as_view()),
    url(r'^api/auth/user/$', AuthUserView.as_view()),
    url(r'^api/auth/$', AuthView.as_view()),
    url(r'^api/', include(router.urls, namespace='api')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', get_swagger_view()),
]

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
