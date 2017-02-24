from rest_framework.permissions import BasePermission


class IsSameUser(BasePermission):
    message = 'You can modify only your own user data.'

    def has_object_permission(self, request, view, obj):
        return request.user == obj


class IsNotVerified(BasePermission):
    message = 'Mail is already verified.'

    def has_object_permission(self, request, view, obj):
        return not request.user.mail_verified
