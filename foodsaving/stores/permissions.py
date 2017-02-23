from datetime import timedelta

from django.utils import timezone
from rest_framework import permissions


class IsUpcoming(permissions.BasePermission):
    message = 'The pickup date is in the past.'

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.date > timezone.now() + timedelta(minutes=1)


class HasJoinedPickupDate(permissions.BasePermission):
    message = 'You have not joined this pickup date.'

    def has_object_permission(self, request, view, obj):
        return obj.collectors.filter(id=request.user.id).exists()


class HasNotJoinedPickupDate(permissions.BasePermission):
    message = 'You have already joined this pickup date.'

    def has_object_permission(self, request, view, obj):
        return not obj.collectors.filter(id=request.user.id).exists()
