from django.dispatch import Signal

post_pickup_create = Signal()
post_pickup_modify = Signal()
post_pickup_join = Signal()
post_pickup_leave = Signal()
post_series_create = Signal()
post_series_modify = Signal()
post_store_create = Signal()
post_store_modify = Signal()
pickup_done = Signal()
pickup_missed = Signal()
