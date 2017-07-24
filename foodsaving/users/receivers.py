from django.dispatch import receiver

from foodsaving.invitations.signals import invitation_accepted


@receiver(invitation_accepted)
def handle_invitation_accepted(sender, **kwargs):
    # good UX: current_group is changed to the newly joined group
    group = kwargs.get('group')
    user = kwargs.get('accepted_user')
    user.current_group = group
    user.save()
