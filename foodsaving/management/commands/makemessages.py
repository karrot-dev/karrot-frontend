from django_jinja.management.commands.makemessages import Command as DjangoJinjaMakeMessagesCommand


class Command(DjangoJinjaMakeMessagesCommand):
    CUSTOM_SUCCESS_MESSAGE = 'successfully pulled all text marked for translation'

    def handle(self, *args, **options):
        if options.get('extensions', None) and 'jinja' not in options['extensions']:
            options['extensions'] += ['jinja']
        else:
            options['extensions'] = ['html', 'txt', 'py', 'jinja']

        if 'en' not in options['locale']:
            options['locale'].append('en')

        super(Command, self).handle(*args, **options)

        self.stdout.write(self.style.SUCCESS(self.CUSTOM_SUCCESS_MESSAGE))
