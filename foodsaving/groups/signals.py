from django.dispatch import receiver

from foodsaving.groups.models import Group
from foodsaving.users.api import pre_delete_user


@receiver(pre_delete_user)
def delete_user_handler(sender, **kwargs):
    user = kwargs.get('user')
    for _ in Group.objects.filter(members__in=[user, ]):
        _.members.remove(user)
