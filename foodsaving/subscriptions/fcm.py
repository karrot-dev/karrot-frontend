import logging

from django.conf import settings
from pyfcm import FCMNotification

from foodsaving.subscriptions.models import PushSubscription

logger = logging.getLogger(__name__)

fcm = None

if hasattr(settings, 'FCM_SERVER_KEY'):
    fcm = FCMNotification(api_key=settings.FCM_SERVER_KEY)
else:
    logger.warning('Please configure FCM_SERVER_KEY in your settings to use want to use push messaging')


def notify_multiple_devices(**kwargs):
    """
    Send a message to multiple devices.

    A simple wrapper of pyfcm's notify_multiple_devices.
    See https://github.com/olucurious/PyFCM/blob/master/pyfcm/fcm.py for more details on options, etc.
    """

    if fcm is None:
        return None

    response = fcm.notify_multiple_devices(**kwargs)
    tokens = kwargs.get('registration_ids', [])

    # check for invalid tokens and remove any corresponding push subscriptions
    for index, result in enumerate(response['results']):
        if 'error' in result and result['error'] == 'InvalidRegistration':
            PushSubscription.objects.filter(token=tokens[index]).delete()

    return response
