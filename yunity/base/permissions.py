from rest_framework.permissions import BasePermission


class DenyAll(BasePermission):
    message = 'Forbidden.'

    def has_permission(self, request, view):
        return False
