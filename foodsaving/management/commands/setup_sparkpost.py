import requests
from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def log_response(self, response):
        try:
            json = response.json()
        except:  # noqa
            json = ''
        print(response.request.method, response.request.url)
        print(response.status_code, json)
        print()

    def handle(self, *args, **options):
        # use subaccounts for sending emails and receiving emailevents
        # use main account for setting up relay

        hostname = settings.HOSTNAME

        s = requests.Session()

        # set up event webhook
        s.headers.update({'Authorization': settings.ANYMAIL['SPARKPOST_API_KEY']})

        response = s.get('https://api.sparkpost.com/api/v1/webhooks')
        self.log_response(response)

        webhooks = response.json()
        for w in webhooks['results']:
            w_id = w['id']
            response = s.delete('https://api.sparkpost.com/api/v1/webhooks/' + w_id)
            self.log_response(response)

        response = s.post(
            'https://api.sparkpost.com/api/v1/webhooks',
            json={
                "name": settings.SITE_NAME[:23],
                "target": hostname + "/api/webhooks/email_event/",
                "auth_type": "basic",
                "auth_credentials": {"username": "xxx", "password": settings.SPARKPOST_WEBHOOK_SECRET},
                "events": settings.SPARKPOST_EMAIL_EVENTS,
            }
        )
        self.log_response(response)

        # set up relay webhook
        s.headers.update({'Authorization': settings.SPARKPOST_ACCOUNT_KEY})

        response = s.post('https://api.sparkpost.com/api/v1/inbound_domains', json={
            'domain': settings.SPARKPOST_RELAY_DOMAIN
        })
        self.log_response(response)

        response = s.get('https://api.sparkpost.com/api/v1/relay-webhooks')
        self.log_response(response)
        relay_webhooks = response.json()
        existing_relay = None
        for w in relay_webhooks['results']:
            if w['match']['domain'] == settings.SPARKPOST_RELAY_DOMAIN:
                existing_relay = w

        relay_webhook_data = {
            "name": (settings.SPARKPOST_RELAY_DOMAIN + ' relay')[:23],
            "target": hostname + "/api/webhooks/incoming_email/",
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
        else:
            response = s.put(
                'https://api.sparkpost.com/api/v1/relay-webhooks/' + existing_relay['id'],
                json=relay_webhook_data
            )
            self.log_response(response)
