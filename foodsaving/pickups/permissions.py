from rest_framework import permissions
from django.utils.translation import ugettext_lazy as _


class IsUpcoming(permissions.BasePermission):
    message = _('The pickup date is in the past.')

    def has_object_permission(self, request, view, obj):
        # do allow GETs for pick-ups in the past
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return obj.is_upcoming()


class IsEmptyPickupDate(permissions.BasePermission):
    message = _('You can only delete empty pickup dates.')

    def has_object_permission(self, request, view, obj):
        return obj.is_empty()


class HasJoinedPickupDate(permissions.BasePermission):
    message = _('You have not joined this pickup date.')

    def has_object_permission(self, request, view, obj):
        return obj.is_collector(request.user)


class HasNotJoinedPickupDate(permissions.BasePermission):
    message = _('You have already joined this pickup date.')

    def has_object_permission(self, request, view, obj):
        return not obj.is_collector(request.user)


class IsNotFull(permissions.BasePermission):
    message = _('Pickup date is already full.')

    def has_object_permission(self, request, view, obj):
        return not obj.is_full()


class IsSameCollector(permissions.BasePermission):
    message = _('This feedback is given by another user.')

    def has_object_permission(self, request, view, obj):
        return obj.given_by == request.user
