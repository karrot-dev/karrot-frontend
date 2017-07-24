from django.contrib import admin

from foodsaving.invitations.models import Invitation


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    pass
