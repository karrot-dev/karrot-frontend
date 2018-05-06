from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
from django.utils import timezone

from foodsaving.groups.models import GroupMembership
from foodsaving.pickups import stats
from foodsaving.pickups.models import PickupDate, Feedback


@receiver(pre_delete, sender=GroupMembership)
def leave_group_handler(sender, instance, **kwargs):
    group = instance.group
    user = instance.user
    for _ in PickupDate.objects. \
            filter(date__gte=timezone.now()). \
            filter(collectors__in=[user, ]). \
            filter(store__group=group):
        _.collectors.remove(user)


@receiver(post_save, sender=Feedback)
def feedback_created(sender, instance, created, **kwargs):
    if not created:
        return
    stats.feedback_given(instance)
