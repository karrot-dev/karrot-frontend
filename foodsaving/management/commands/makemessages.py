from django_jinja.management.commands.makemessages import Command as DjangoJinjaMakeMessagesCommand


class Command(DjangoJinjaMakeMessagesCommand):

    @classmethod
    def update_options(cls, **options):
        if options.get('extensions', None) is None:
            options['extensions'] = ['html', 'txt', 'py', 'jinja2']

        if 'en' not in options['locale']:
            options['locale'].append('en')

        return options

    def handle(self, *args, **options):
        options = self.update_options(**options)
        super(Command, self).handle(*args, **options)
