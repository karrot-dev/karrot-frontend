from rest_framework.permissions import BasePermission
from django.utils.translation import ugettext_lazy as _


class IsSameUser(BasePermission):
    message = _('You can modify only your own user data.')

    def has_object_permission(self, request, view, obj):
        return request.user == obj


class IsNotVerified(BasePermission):
    message = _('Mail is already verified.')

    def has_object_permission(self, request, view, obj):
        return not request.user.mail_verified
