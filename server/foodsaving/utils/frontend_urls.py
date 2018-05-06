from furl import furl

from config import settings


def store_url(store):
    return '{hostname}/#/group/{group_id}/store/{store_id}/pickups'.format(
        hostname=settings.HOSTNAME,
        group_id=store.group.id,
        store_id=store.id,
    )


def user_url(user):
    return '{hostname}/#/user/{user_id}/'.format(
        hostname=settings.HOSTNAME,
        user_id=user.id,
    )


def group_wall_url(group):
    return '{hostname}/#/group/{group_id}/wall'.format(
        hostname=settings.HOSTNAME,
        group_id=group.id
    )


def conversation_mute_url(group, conversation):
    return '{}?mute_conversation={}'.format(group_wall_url(group), conversation.id)


def group_settings_url(group):
    return '{hostname}/#/group/{group_id}/settings'.format(
        hostname=settings.HOSTNAME,
        group_id=group.id,
    )


def invite_url(invitation):
    invite_url = furl('{hostname}/#/signup'.format(hostname=settings.HOSTNAME))
    invite_url.fragment.args = {
        'invite': invitation.token,
        'email': invitation.email
    }
    return invite_url


def user_delete_url(code):
    return '{hostname}/#/delete-user?code={code}'.format(
        hostname=settings.HOSTNAME,
        code=code
    )


def user_emailverification_url(code):
    return '{hostname}/#/email/verify?code={code}'.format(
        hostname=settings.HOSTNAME,
        code=code
    )


def user_passwordreset_url(code):
    return '{hostname}/#/password/reset?code={code}'.format(
        hostname=settings.HOSTNAME,
        code=code
    )
