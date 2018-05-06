from foodsaving.utils.email_utils import prepare_email
from foodsaving.utils.frontend_urls import invite_url


def prepare_emailinvitation_email(invitation):
    return prepare_email('emailinvitation', None, {
        'group_name': invitation.group.name,
        'invite_url': invite_url(invitation),
        'email': invitation.email,
        'invited_by_name': invitation.invited_by.display_name,
    }, to=invitation.email)
