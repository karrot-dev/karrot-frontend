from django.dispatch import receiver

from foodsaving.groups.models import Group
from foodsaving.users.api import pre_user_delete


@receiver(pre_user_delete)
def delete_user_handler(sender, **kwargs):
    user = kwargs.get('user')
    for _ in Group.objects.filter(members__in=[user, ]):
        _.members.remove(user)
