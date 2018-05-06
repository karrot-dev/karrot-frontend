from email.utils import formataddr

import html2text
from anymail.message import AnymailMessage
from babel.dates import format_date, format_time
from django.template import TemplateDoesNotExist
from django.template.loader import render_to_string, get_template
from django.utils import translation
from django.utils.timezone import get_current_timezone
from django.utils.translation import to_locale, get_language
from jinja2 import Environment

from config import settings
from foodsaving.utils import stats
from foodsaving.utils.frontend_urls import store_url, user_url


def date_filter(value):
    return format_date(
        value.astimezone(get_current_timezone()),
        format='full',
        locale=to_locale(get_language()),
    )


def time_filter(value):
    return format_time(
        value,
        format='short',
        locale=to_locale(get_language()),
        tzinfo=get_current_timezone(),
    )


def jinja2_environment(**options):
    env = Environment(**options)
    env.filters['date'] = date_filter
    env.filters['time'] = time_filter
    env.globals['store_url'] = store_url
    env.globals['user_url'] = user_url
    return env


def generate_plaintext_from_html(html):
    # always create an instance as it keeps state inside it
    # and will create ever increment link references otherwise
    h = html2text.HTML2Text()
    h.ignore_tables = True
    h.inline_links = False
    h.ignore_images = True
    return h.handle(html)


class StatCollectingAnymailMessage(AnymailMessage):

    def send(self, *args, **kwargs):
        try:
            super(StatCollectingAnymailMessage, self).send(*args, **kwargs)
            stats.email_sent(recipient_count=len(self.to))
        except Exception as exception:
            stats.email_error(recipient_count=len(self.to))
            raise exception


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

    email = StatCollectingAnymailMessage(**message_kwargs)

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
