from anymail.message import AnymailMessage
from django.template import TemplateDoesNotExist
from django.template.loader import render_to_string, get_template
from furl import furl

from config import settings


def prepare_accountdelete_request_email(user):
    return prepare_email('accountdelete_request', user)


def prepare_accountdelete_success_email(user):
    return prepare_email('accountdelete_success', user)


def prepare_changemail_notice_email(user):
    return prepare_email('changemail_notice', user)


def prepare_changemail_success_email(user):
    return prepare_email('changemail_success', user, {
        'url': 'ERROR_URL_HAS_NOT_BEEN_DEFINED'
    })


def prepare_emailinvitation_email(invitation):
    invite_url = furl('{hostname}/#/signup'.format(hostname=settings.HOSTNAME))
    invite_url.fragment.args = {
        'invite': invitation.token,
        'email': invitation.email
    }
    return prepare_email('emailinvitation', None, {
        'group_name': invitation.group.name,
        'invite_url': invite_url,
        'email': invitation.email,
        'invited_by_name': invitation.invited_by.display_name,
    }, to=invitation.email)


def prepare_mailverification_email(user, verification_code):
    return prepare_email('mailverification', user, {
        'url': '{hostname}/#/verify-mail?key={code}'.format(
            hostname=settings.HOSTNAME,
            code=verification_code.code
        )
    }, to=user.unverified_email)


def prepare_newpassword_email(user, new_password):
    return prepare_email('newpassword', user, {'password': new_password})


def prepare_passwordreset_request_email(user):
    return prepare_email('passwordreset_request', user, {
        'url': 'ERROR_URL_HAS_NOT_BEEN_DEFINED'
    })


def prepare_passwordreset_success_email(user):
    return prepare_email('passwordreset_success', user, {})


def prepare_send_new_verification_code_email(user, verification_code):
    return prepare_email('send_new_verification_code', user, {
        'url': '{hostname}/#/verify-mail?key={code}'.format(
            hostname=settings.HOSTNAME,
            code=verification_code.code
        )
    }, to=user.unverified_email)


def prepare_email(template, user=None, extra_context=None, to=None):
    context = {
        'site_name': settings.SITE_NAME,
    }

    if extra_context is not None:
        context.update(extra_context)

    if user is not None:
        context.update({
            'user': user,
            'user_display_name': user.get_full_name(),
        })

    if to is None:
        if user is None:
            raise Exception('Do not know who to send the email to, no "user" or "to" field')
        to = user.email

    email = AnymailMessage(
        subject=render_to_string('{}.subject.jinja2'.format(template), context).replace('\n', ''),
        body=render_to_string('{}.text.jinja2'.format(template), context),
        to=[to],
        from_email=settings.DEFAULT_FROM_EMAIL,
        track_clicks=False,
        track_opens=False
    )

    try:
        html_template = get_template('{}.html.jinja2'.format(template))
        html_content = html_template.render(context)
        email.attach_alternative(html_content, 'text/html')
    except TemplateDoesNotExist:
        pass

    return email
