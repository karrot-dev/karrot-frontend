import requests
import sys
from django.conf import settings
from django.core.management.base import BaseCommand
from rest_framework import status


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--quiet', action='store_true', dest='quiet')

    errors = []

    def log_response(self, response):
        if not self.quiet:
            try:
                json = response.json()
            except:  # noqa
                json = ''
            print(response.request.method, response.request.url)
            print(response.status_code, json)
            print()

    def setup_event_webhook(self, s):
        response = s.get('https://api.sparkpost.com/api/v1/webhooks')
        self.log_response(response)
        if not status.is_success(response.status_code):
            self.errors.append(
                'Failed to get existing event webhooks.' +
                'Check if your subaccount API key has permission to Read/Write Event Webhooks.'
            )

        webhooks = response.json()
        event_webhook_data = {
            "name": settings.SITE_NAME[:23],  # obey sparkpost name length limit
            "target": settings.HOSTNAME + "/api/webhooks/email_event/",
            "auth_type": "basic",
            "auth_credentials": {"username": "xxx", "password": settings.SPARKPOST_WEBHOOK_SECRET},
            "events": settings.SPARKPOST_EMAIL_EVENTS,
        }
        existing_event_webhook = None
        for w in webhooks['results']:
            if w['target'] == event_webhook_data['target']:
                existing_event_webhook = w

        if existing_event_webhook is None:
            print('WARNING: creating a new event webhook for {}. '
                  'Please check on sparkpost.com if there are unused ones.'.format(event_webhook_data['target']))
            response = s.post(
                'https://api.sparkpost.com/api/v1/webhooks',
                json=event_webhook_data
            )
            self.log_response(response)
            if not status.is_success(response.status_code):
                self.errors.append('Failed to create new event webhook')
        else:
            # TODO fix updating, if fails quite often
            return
            response = s.put(
                'https://api.sparkpost.com/api/v1/webhooks/' + existing_event_webhook['id'],
                json=event_webhook_data
            )
            self.log_response(response)
            if not status.is_success(response.status_code):
                self.errors.append('Failed to update existing event webhook')

    def setup_relay_webhook(self, s):
        # create inbound domain with best effort, ignore failures
        response = s.post('https://api.sparkpost.com/api/v1/inbound_domains', json={
            'domain': settings.SPARKPOST_RELAY_DOMAIN
        })
        self.log_response(response)

        response = s.get('https://api.sparkpost.com/api/v1/relay-webhooks')
        self.log_response(response)
        if not status.is_success(response.status_code):
            self.errors.append(
                'Failed to get existing relay webhooks.' +
                'Check if your main account API key has permission to Read/Write Relay Webhooks.'
            )

        relay_webhooks = response.json()
        existing_relay = None
        for w in relay_webhooks['results']:
            if w['match']['domain'] == settings.SPARKPOST_RELAY_DOMAIN:
                existing_relay = w

        relay_webhook_data = {
            "name": settings.SPARKPOST_RELAY_DOMAIN + ' relay',
            "target": settings.HOSTNAME + "/api/webhooks/incoming_email/",
            "auth_token": settings.SPARKPOST_RELAY_SECRET,
            "match": {"domain": settings.SPARKPOST_RELAY_DOMAIN}
        }
        if existing_relay is None:
            print('WARNING: creating a new relay webhook for {}. '
                  'Please check on sparkpost.com if there are unused ones.'.format(settings.SPARKPOST_RELAY_DOMAIN))
            response = s.post(
                'https://api.sparkpost.com/api/v1/relay-webhooks',
                json=relay_webhook_data
            )
            self.log_response(response)
            if not status.is_success(response.status_code):
                self.errors.append('Failed to create new relay webhook')
        else:
            response = s.put(
                'https://api.sparkpost.com/api/v1/relay-webhooks/' + existing_relay['id'],
                json=relay_webhook_data
            )
            self.log_response(response)
            if not status.is_success(response.status_code):
                self.errors.append('Failed to update existing relay webhook')

    def handle(self, *args, **options):
        s = requests.Session()
        self.quiet = options['quiet']

        # use subaccounts for sending emails and receiving email events
        s.headers.update({'Authorization': settings.ANYMAIL['SPARKPOST_API_KEY']})
        self.setup_event_webhook(s)

        # use main account for setting up relay
        s.headers.update({'Authorization': settings.SPARKPOST_ACCOUNT_KEY})
        self.setup_relay_webhook(s)

        if len(self.errors) > 0:
            print('errors:')
            for e in self.errors:
                print(e)
            sys.exit(1)
