from django.test import TestCase

from ..commands.makemessages import Command as MakeMessagesCommand


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
