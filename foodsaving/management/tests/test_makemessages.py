from unittest.mock import patch
from django.test import TestCase

from ..commands.makemessages import Command as MakeMessagesCommand
from django_jinja.management.commands.makemessages import Command as DjangoJinjaMakeMessagesCommand

makemessages = MakeMessagesCommand
django_jinja_makemessages = DjangoJinjaMakeMessagesCommand


class CustomMakeMessagesTest(TestCase):
    def test_update_options(self):
        options = {
            'locale': [],
        }

        modified_options = MakeMessagesCommand.update_options(**options)
        self.assertIn('jinja', modified_options['extensions'])
        self.assertIn('en', modified_options['locale'])

        options['extensions'] = ['py']
        modified_options_with_initial_extension = MakeMessagesCommand.update_options(**options)
        self.assertIn('jinja', modified_options_with_initial_extension['extensions'])

    @patch(__name__ + '.django_jinja_makemessages.handle')
    @patch(__name__ + '.makemessages.update_options', return_value={})
    def test_handle(self, mock1, mock2):
        MakeMessagesCommand.handle(MakeMessagesCommand())
        assert MakeMessagesCommand.update_options.called
        assert DjangoJinjaMakeMessagesCommand.handle.called
