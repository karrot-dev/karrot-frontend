from django.utils.translation import ugettext_lazy as _
from rest_framework.permissions import BasePermission


class IsNotVerified(BasePermission):
    message = _('Mail is already verified.')

    def has_object_permission(self, request, view, obj):
        return not request.user.mail_verified
