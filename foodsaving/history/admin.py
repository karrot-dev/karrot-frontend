from django.contrib import admin

from foodsaving.history.models import History


@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    pass
