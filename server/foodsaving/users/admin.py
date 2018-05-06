from django.contrib import admin

from foodsaving.users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass
