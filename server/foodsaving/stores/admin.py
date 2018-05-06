from django.contrib import admin

from foodsaving.stores.models import Store


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    pass
