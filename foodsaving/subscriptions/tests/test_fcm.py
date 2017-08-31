from contextlib import contextmanager
from importlib import reload
from unittest.mock import patch

import requests_mock
from django.test import TestCase

import foodsaving.subscriptions.fcm
from foodsaving.subscriptions.fcm import notify_multiple_devices
from foodsaving.subscriptions.models import PushSubscription
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


@contextmanager
def logger_warning_mock():
    with patch('logging.Logger.warning') as mock_logging:
        yield mock_logging


@contextmanager
def fcm_reload_without_config():
    from django.conf import settings
    original = settings.FCM_SERVER_KEY
    try:
        del settings.FCM_SERVER_KEY
        reload(foodsaving.subscriptions.fcm)
        yield
    finally:
        settings.FCM_SERVER_KEY = original
        reload(foodsaving.subscriptions.fcm)


@requests_mock.Mocker()
class FCMTests(TestCase):
    def test_sends_without_error(self, m):
        m.post('https://fcm.googleapis.com/fcm/send', json={})
        notify_multiple_devices(registration_ids=['mytoken'])

    def test_removes_invalid_subscriptions(self, m):
        m.post('https://fcm.googleapis.com/fcm/send', json={
            'results': [
                {
                    # not an error
                },
                {
                    'error': 'InvalidRegistration'
                }
            ]
        })
        user = UserFactory()
        valid_token = faker.uuid4()
        invalid_token = faker.uuid4()
        PushSubscription.objects.create(user=user, token=valid_token)
        PushSubscription.objects.create(user=user, token=invalid_token)
        result = notify_multiple_devices(registration_ids=[valid_token, invalid_token])
        self.assertIsNotNone(result)
        self.assertEqual(PushSubscription.objects.filter(token=valid_token).count(), 1)
        self.assertEqual(PushSubscription.objects.filter(token=invalid_token).count(), 0)

    def test_continues_if_config_not_present(self, m):
        with logger_warning_mock() as warning_mock:
            with fcm_reload_without_config():
                warning_mock.assert_called_with(
                    'Please configure FCM_SERVER_KEY in your settings to use want to use push messaging')
                result = notify_multiple_devices(registration_ids=['mytoken'])
                self.assertIsNone(result)
