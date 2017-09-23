from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.utils import timezone

from foodsaving.groups.models import GroupMembership
from foodsaving.stores.models import PickupDate


@receiver(pre_delete, sender=GroupMembership)
def leave_group_handler(sender, instance, **kwargs):
    group = instance.group
    user = instance.user
    for _ in PickupDate.objects. \
            filter(date__gte=timezone.now()). \
            filter(collectors__in=[user, ]). \
            filter(store__group=group):
        _.collectors.remove(user)
