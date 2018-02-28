import itertools
from email.utils import formataddr

import html2text
from anymail.message import AnymailMessage
from babel.dates import format_date
from dateutil.relativedelta import relativedelta
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.template import TemplateDoesNotExist
from django.template.loader import render_to_string, get_template
from django.utils import timezone
from django.utils import translation
from django.utils.timezone import get_current_timezone
from django.utils.translation import to_locale, get_language
from furl import furl
from jinja2 import Environment

from config import settings
from foodsaving.conversations.models import ConversationMessage
from foodsaving.groups.models import Group
from foodsaving.pickups.models import PickupDate
from foodsaving.webhooks.api import make_local_part


def date_filter(value):
    return format_date(value, format='full', locale=to_locale(get_language()))


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


def prepare_conversation_message_notification(user, message):
    group = message.conversation.target
    target_type = message.conversation.target_type
    if group is None or target_type != ContentType.objects.get_for_model(Group):
        raise Exception('Cannot send message notification if conversation does not belong to a group')

    reply_to_name = group.name
    conversation_url = '{hostname}/#/group/{group_id}/wall'.format(
        hostname=settings.HOSTNAME,
        group_id=group.id
    )
    mute_url = '{}?mute_conversation={}'.format(conversation_url, message.conversation.id)
    conversation_name = group.name

    local_part = make_local_part(message.conversation, user)
    reply_to = formataddr((reply_to_name, '{}@{}'.format(local_part, settings.SPARKPOST_RELAY_DOMAIN)))
    from_email = formataddr((message.author.display_name, settings.DEFAULT_FROM_EMAIL))

    with translation.override(user.language):
        return prepare_email(
            'conversation_message_notification',
            from_email=from_email,
            user=user,
            reply_to=[reply_to],
            context={
                'conversation_name': conversation_name,
                'author_name': message.author.display_name,
                'message_content': message.content,
                'conversation_url': conversation_url,
                'mute_url': mute_url
            }
        )


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


def calculate_group_summary_dates(group):
    with timezone.override(group.timezone):
        tz = get_current_timezone()

        # midnight last night in the groups local timezone
        midnight = tz.localize(timezone.now().replace(
            tzinfo=None, hour=0, minute=0, second=0, microsecond=0
        ))

        # 7 days before that
        from_date = midnight - relativedelta(days=7)

        # a week after from date
        to_date = from_date + relativedelta(days=7)

        return from_date, to_date


def prepare_group_summary_data(group, from_date, to_date):
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

    return {
        # minus one second so it's displayed as the full day
        'to_date': to_date - relativedelta(seconds=1),
        'from_date': from_date,
        'group': group,
        'new_users': new_users,
        'pickups_done_count': pickups_done_count,
        'pickups_missed_count': pickups_missed_count,
        'messages': messages,
    }


def prepare_group_summary_emails(group, from_date, to_date):
    """Prepares one email per language"""
    context = prepare_group_summary_data(group, from_date, to_date)
    grouped_members = itertools.groupby(group.members.order_by('language'), key=lambda member: member.language)
    return [prepare_email(template='group_summary',
                          context=context,
                          to=[member.email for member in members],
                          language=language) for (language, members) in grouped_members]


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


def prepare_email(template, user=None, context=None, to=None, language=None, **kwargs):
    context = dict(context) if context else {}

    context.update({
        'site_name': settings.SITE_NAME,
        'hostname': settings.HOSTNAME,
    })

    if user:
        context.update({
            'user': user,
            'user_display_name': user.get_full_name(),
        })

    if not to:
        if not user:
            raise Exception('Do not know who to send the email to, no "user" or "to" field')
        to = [user.email]

    if isinstance(to, str):
        to = [to]

    if user and not language:
        language = user.language

    subject, text_content, html_content = prepare_email_content(template, context, language)

    from_email = formataddr((settings.SITE_NAME, settings.DEFAULT_FROM_EMAIL))

    message_kwargs = {
        'subject': subject,
        'body': text_content,
        'to': to,
        'from_email': from_email,
        'track_clicks': False,
        'track_opens': False,
        **kwargs,
    }

    email = AnymailMessage(**message_kwargs)

    if html_content:
        email.attach_alternative(html_content, 'text/html')

    return email


def prepare_email_content(template, context, language='en'):
    with translation.override(language):

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

        subject = render_to_string('{}.subject.jinja2'.format(template), context).replace('\n', '')

        return subject, text_content, html_content
