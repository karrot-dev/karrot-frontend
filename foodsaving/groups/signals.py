from django.dispatch import Signal

post_group_join = Signal()
pre_group_leave = Signal()
post_group_modify = Signal()
post_group_create = Signal()
