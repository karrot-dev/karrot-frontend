from django.dispatch import receiver

from foodsaving.audit.models import Audit, AuditTypus
from foodsaving.groups.api import post_group_join, post_group_leave
from foodsaving.groups.serializers import post_group_create, post_group_modify
from foodsaving.stores.api import post_store_delete, pre_pickup_delete, pre_series_delete
from foodsaving.stores.serializers import post_store_create, post_store_modify, post_pickup_create, \
    post_pickup_modify, post_series_create, post_series_modify
from foodsaving.stores.models import pickup_done


def make_handler(typus):
    def fn(sender, **kwargs):
        a = Audit.objects.create(
            typus=typus,
            group=kwargs.get('group'),
            store=kwargs.get('store'),
            payload=kwargs.get('payload')
        )
        a.users.add(kwargs.get('user'))
        a.save()
    return fn


for signal, typus in [
    (post_group_create, AuditTypus.GROUP_CREATE),
    (post_group_modify, AuditTypus.GROUP_MODIFY),
    (post_group_join, AuditTypus.GROUP_JOIN),
    (post_group_leave, AuditTypus.GROUP_LEAVE),
    (post_store_create, AuditTypus.STORE_CREATE),
    (post_store_modify, AuditTypus.STORE_MODIFY),
    (post_store_delete, AuditTypus.STORE_DELETE),
    (post_pickup_create, AuditTypus.PICKUP_CREATE),
    (post_pickup_modify, AuditTypus.PICKUP_MODIFY),
    (pre_pickup_delete, AuditTypus.PICKUP_DELETE),
    (post_series_create, AuditTypus.SERIES_CREATE),
    (post_series_modify, AuditTypus.SERIES_MODIFY),
    (pre_series_delete, AuditTypus.SERIES_DELETE),
]:
    signal.connect(make_handler(typus=typus), weak=False)


@receiver(pickup_done)
def handle_pickups_done(sender, **kwargs):
    a = Audit.objects.create(
        typus=AuditTypus.PICKUP_DONE,
        group=kwargs.get('group'),
        store=kwargs.get('store'),
        payload=kwargs.get('payload'),
    )
    a.users.set(kwargs.get('users'))
    a.save()
