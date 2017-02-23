from django.dispatch import receiver

from foodsaving.history.models import History, HistoryTypus
from foodsaving.groups.serializers import post_group_create, post_group_modify, post_group_join, pre_group_leave
from foodsaving.stores.api import post_store_delete, pre_pickup_delete, pre_series_delete, post_pickup_join, \
    post_pickup_leave
from foodsaving.stores.serializers import post_store_create, post_store_modify, post_pickup_create, \
    post_pickup_modify, post_series_create, post_series_modify
from foodsaving.stores.models import pickup_done


def make_handler(typus):
    def fn(sender, **kwargs):
        a = History.objects.create(
            typus=typus,
            group=kwargs.get('group'),
            store=kwargs.get('store'),
            payload=kwargs.get('payload')
        )
        a.users.add(kwargs.get('user'))
        a.save()
    return fn


for signal, typus in [
    (post_group_create, HistoryTypus.GROUP_CREATE),
    (post_group_modify, HistoryTypus.GROUP_MODIFY),
    (post_group_join, HistoryTypus.GROUP_JOIN),
    (pre_group_leave, HistoryTypus.GROUP_LEAVE),
    (post_store_create, HistoryTypus.STORE_CREATE),
    (post_store_modify, HistoryTypus.STORE_MODIFY),
    (post_store_delete, HistoryTypus.STORE_DELETE),
    (post_pickup_create, HistoryTypus.PICKUP_CREATE),
    (post_pickup_modify, HistoryTypus.PICKUP_MODIFY),
    (pre_pickup_delete, HistoryTypus.PICKUP_DELETE),
    (post_series_create, HistoryTypus.SERIES_CREATE),
    (post_series_modify, HistoryTypus.SERIES_MODIFY),
    (pre_series_delete, HistoryTypus.SERIES_DELETE),
    (post_pickup_join, HistoryTypus.PICKUP_JOIN),
    (post_pickup_leave, HistoryTypus.PICKUP_LEAVE)
]:
    signal.connect(make_handler(typus=typus), weak=False)


@receiver(pickup_done)
def handle_pickups_done(sender, **kwargs):
    a = History.objects.create(
        typus=HistoryTypus.PICKUP_DONE,
        group=kwargs.get('group'),
        store=kwargs.get('store'),
        payload=kwargs.get('payload'),
    )
    a.users.set(kwargs.get('users'))
    a.save()
