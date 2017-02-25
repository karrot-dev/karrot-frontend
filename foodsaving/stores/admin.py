from django.contrib import admin

from foodsaving.stores.models import PickupDateSeries, PickupDate, Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    pass


@admin.register(PickupDate)
class PickupDateAdmin(admin.ModelAdmin):
    pass


@admin.register(PickupDateSeries)
class PickupDateSeriesAdmin(admin.ModelAdmin):
    pass

