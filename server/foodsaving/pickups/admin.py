from django.contrib import admin

from foodsaving.pickups.models import PickupDateSeries, PickupDate


@admin.register(PickupDate)
class PickupDateAdmin(admin.ModelAdmin):
    pass


@admin.register(PickupDateSeries)
class PickupDateSeriesAdmin(admin.ModelAdmin):
    pass
