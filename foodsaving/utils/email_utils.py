import html2text
from anymail.message import AnymailMessage
from dateutil.relativedelta import relativedelta
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.template import TemplateDoesNotExist
from django.template.loader import render_to_string, get_template
from django.utils import formats, translation
from django.utils import timezone
from furl import furl
from jinja2 import Environment

from config import settings
from foodsaving.conversations.models import ConversationMessage
from foodsaving.groups.models import Group
from foodsaving.pickups.models import PickupDate


def date_filter(value):
    return formats.date_format(value, 'SHORT_DATE_FORMAT')


def jinja2_environment(**options):
    env = Environment(**options)
    env.filters['date'] = date_filter
    return env


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


def prepare_group_summary_email(group):
    # we do a weekly one...

    # TODO: round to fixed weekly periods (Monday -> Sunday?)
    to_date = timezone.now()
    from_date = to_date - relativedelta(days=7)

    new_users = group.members.filter(
        groupmembership__created_at__gte=from_date,
        groupmembership__created_at__lt=to_date,
    ).all()

    pickups_done_count = PickupDate.objects \
        .annotate(num_collectors=Count('collectors')) \
        .filter(store__group=group,
                date__gte=from_date,
                date__lt=to_date,
                num_collectors__gt=0).count()

    pickups_missed_count = PickupDate.objects \
        .annotate(num_collectors=Count('collectors')) \
        .filter(store__group=group,
                date__gte=from_date,
                date__lt=to_date,
                num_collectors=0).count()

    messages = ConversationMessage.objects.filter(
        conversation__target_type=ContentType.objects.get_for_model(Group),
        conversation__target_id=group.id,
        created_at__gte=from_date,
        created_at__lt=to_date,
    )

    return prepare_email('group_summary', None, {
        'to_date': to_date,
        'from_date': from_date,
        'group': group,
        'new_users': new_users,
        'pickups_done_count': pickups_done_count,
        'pickups_missed_count': pickups_missed_count,
        'messages': messages,
    }, to='NOTSURE@RIGHTNOW.com')


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


def generate_plaintext_from_html(html):
    # always create an instance as it keeps state inside it
    # and will create ever increment link references otherwise
    h = html2text.HTML2Text()
    h.ignore_tables = True
    h.inline_links = False
    h.ignore_images = True
    return h.handle(html)


def prepare_email(template, user=None, extra_context=None, to=None):
    with translation.override(user.language if user else 'en'):

        context = {
            'site_name': settings.SITE_NAME,
        }

        if extra_context:
            context.update(extra_context)

        if user:
            context.update({
                'user': user,
                'user_display_name': user.get_full_name(),
            })

        if not to:
            if not user:
                raise Exception('Do not know who to send the email to, no "user" or "to" field')
            to = user.email

        html_content = None

        try:
            html_template = get_template('{}.html.jinja2'.format(template))
            html_content = html_template.render(context)
        except TemplateDoesNotExist:
            pass

        try:
            text_template = get_template('{}.text.jinja2'.format(template))
            text_content = text_template.render(context)
        except TemplateDoesNotExist:
            if html_content:
                text_content = generate_plaintext_from_html(html_content)
            else:
                raise Exception('Nothing to use for text content, no text or html templates available.')

        email = AnymailMessage(
            subject=render_to_string('{}.subject.jinja2'.format(template), context).replace('\n', ''),
            body=text_content,
            to=[to],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        )

        if html_content:
            email.attach_alternative(html_content, 'text/html')

        return email
