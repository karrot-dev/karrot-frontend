from django.contrib import admin

from foodsaving.groups.models import Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    pass
