from rest_framework.permissions import BasePermission


class UserInGroup(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.group.members.all()
