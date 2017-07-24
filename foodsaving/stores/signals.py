from django.dispatch import receiver
from django.utils import timezone

from foodsaving.groups.signals import pre_group_leave
from foodsaving.stores.models import PickupDate
from foodsaving.users.api import pre_user_delete


@receiver(pre_group_leave)
def leave_group_handler(sender, **kwargs):
    group = kwargs.get('group')
    user = kwargs.get('user')
    for _ in PickupDate.objects. \
            filter(date__gte=timezone.now()). \
            filter(collectors__in=[user, ]). \
            filter(store__group=group):
        _.collectors.remove(user)


@receiver(pre_user_delete)
def delete_user_handler(sender, **kwargs):
    user = kwargs.get('user')
    for _ in PickupDate.objects. \
            filter(date__gte=timezone.now()). \
            filter(collectors__in=[user, ]):
        _.collectors.remove(user)
