from django.core.management import call_command
from django.test import TestCase
from django.utils.six import StringIO

from ..commands.makemessages import Command as MakeMessagesCommand


class CustomMakeMessagesTest(TestCase):
    def test_makemessages(self):
        out = StringIO()
        locales = ['de']
        options = {
            'locale': locales,
            'stdout': out,
        }

        call_command('makemessages', **options)

        output_messages = [MakeMessagesCommand.CUSTOM_SUCCESS_MESSAGE, 'processing locale en']
        for locale in locales:
            output_messages.append('processing locale %s' % locale)

        for message in output_messages:
            self.assertIn(message, out.getvalue())
