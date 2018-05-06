import html
import os
import re
from collections import namedtuple

from dateutil.relativedelta import relativedelta
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseBadRequest
from django.template.loader import render_to_string
from django.template.utils import get_app_template_dirs
from django.utils import timezone

import foodsaving.conversations.emails
import foodsaving.invitations.emails
import foodsaving.users.emails
from config import settings
from foodsaving.conversations.models import ConversationMessage
from foodsaving.groups.emails import prepare_user_inactive_in_group_email, prepare_group_summary_emails, \
    prepare_group_summary_data
from foodsaving.groups.models import Group
from foodsaving.invitations.models import Invitation
from foodsaving.pickups.emails import prepare_pickup_notification_email
from foodsaving.pickups.models import PickupDate
from foodsaving.users.models import User

foodsaving_basedir = os.path.abspath(os.path.join(settings.BASE_DIR, 'foodsaving'))

MockVerificationCode = namedtuple('VerificationCode', ['code'])


def random_user():
    return User.objects.order_by('?').first()


def random_group():
    return shuffle_groups().first()


def shuffle_groups():
    return Group.objects.order_by('?')


def random_message():
    return ConversationMessage.objects.order_by('?').first()


def pseudo_verification_code():
    return MockVerificationCode(code='0123456789012345678901234567890123456789')


class Handlers:
    def accountdelete_request(self):
        return foodsaving.users.emails.prepare_accountdelete_request_email(user=random_user(),
                                                                           verification_code=pseudo_verification_code())

    def accountdelete_success(self):
        return foodsaving.users.emails.prepare_accountdelete_success_email(user=random_user())

    def changemail_success(self):
        return foodsaving.users.emails.prepare_changemail_success_email(user=random_user())

    def conversation_message_notification(self):
        return foodsaving.conversations.emails.prepare_conversation_message_notification(user=random_user(),
                                                                                         message=random_message())

    def emailinvitation(self):
        invitation = Invitation.objects.first()
        if invitation is None:
            invited_by = random_user()
            group = Group.objects.first()
            invitation = Invitation.objects.create(group=group, invited_by=invited_by,
                                                   email='exampleinvitation@foo.com')
        return foodsaving.invitations.emails.prepare_emailinvitation_email(invitation)

    def group_summary(self):
        from_date = timezone.now() - relativedelta(days=7)
        to_date = from_date + relativedelta(days=7)

        for group in shuffle_groups():
            context = prepare_group_summary_data(group, from_date, to_date)
            summary_emails = prepare_group_summary_emails(group, context)
            if len(summary_emails) is 0:
                continue

            return summary_emails[0]

        raise Exception(
            'No emails were generated, you need at least one verified user in your db, and some activity data...')

    def changemail_request(self):
        return foodsaving.users.emails.prepare_changemail_request_email(
            user=random_user(),
            verification_code=pseudo_verification_code()
        )

    def signup(self):
        return foodsaving.users.emails.prepare_signup_email(
            user=random_user(),
            verification_code=pseudo_verification_code()
        )

    def passwordreset_request(self):
        return foodsaving.users.emails.prepare_passwordreset_request_email(user=random_user(),
                                                                           verification_code=pseudo_verification_code())

    def passwordreset_success(self):
        return foodsaving.users.emails.prepare_passwordreset_success_email(user=random_user())

    def pickup_notification(self):
        user = random_user()

        pickup1 = PickupDate.objects.order_by('?').first()
        pickup2 = PickupDate.objects.order_by('?').first()
        pickup3 = PickupDate.objects.order_by('?').first()
        pickup4 = PickupDate.objects.order_by('?').first()

        localtime = timezone.localtime()

        return prepare_pickup_notification_email(
            user=user,
            group=user.groups.first(),
            tonight_date=localtime,
            tomorrow_date=localtime + relativedelta(days=1),
            tonight_user=[pickup1, pickup2],
            tonight_empty=[pickup3, pickup4],
            tonight_not_full=[pickup4],
            tomorrow_user=[pickup2],
            tomorrow_empty=[pickup3],
            tomorrow_not_full=[pickup4],
        )

    def user_inactive_in_group(self):
        return prepare_user_inactive_in_group_email(
            user=random_user(),
            group=random_group()
        )


handlers = Handlers()


def list_templates(request):
    template_dirs = [s for s in get_app_template_dirs('templates') if re.match(r'.*/foodsaving/.*', s)]

    template_names = set()

    templates = {}

    for directory in template_dirs:
        for directory, dirnames, filenames in os.walk(directory):
            relative_dir = directory[len(foodsaving_basedir) + 1:]
            for filename in filenames:
                if re.match(r'.*\.jinja2$', filename) and not re.match(r'.*\.nopreview\.jinja2$', filename):
                    path = os.path.join(relative_dir, filename)

                    # strip out anything past the first dot for the name
                    name = re.sub(r'\..*$', '', os.path.basename(path))

                    if name != 'template_preview_list':
                        template_names.add(name)

                        formats = []

                        for idx, s in enumerate(['subject', 'text', 'html']):
                            if os.path.isfile('{}.{}.jinja2'.format(os.path.join(directory, name), s)):
                                formats.append(s)
                            elif s == 'text':
                                formats.append('autotext')

                        # only include if some formats were defined (even empty ones would end up with autotext...)
                        if len(formats) > 1:
                            formats.append('raw')

                            templates[name] = {
                                'name': name,
                                'has_handler': name in dir(handlers),
                                'formats': formats,
                            }

    return HttpResponse(render_to_string('template_preview_list.jinja2', {
        'templates': sorted(templates.values(), key=lambda t: t['name'])
    }))


def show_template(request):
    name = request.GET.get('name')
    format = request.GET.get('format', 'html')

    if name is None:
        return HttpResponseBadRequest('must specify template name')

    has_handler = name in dir(handlers)

    if not has_handler:
        return HttpResponseNotFound(
            'Please setup a handler for the <strong>{}</strong> in <strong>{}</strong>'.format(name, __file__))

    email = getattr(handlers, name)()

    if format == 'html':

        html_content = None
        for content, mimetype in email.alternatives:
            if mimetype == 'text/html':
                html_content = content

        if html_content is None:
            return HttpResponseNotFound('{} does not have html content'.format(name))

        return HttpResponse(html_content)

    elif format == 'text' or format == 'autotext':
        return HttpResponse('<pre>{}</pre>'.format(email.body))

    elif format == 'subject':
        return HttpResponse('<pre>{}</pre>'.format(email.subject))

    elif format == 'raw':
        return HttpResponse('<pre>{}</pre>'.format(html.escape(email.message().as_string())))
