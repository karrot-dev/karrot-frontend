from django_jinja.management.commands.makemessages import Command as DjangoJinjaMakeMessagesCommand


class Command(DjangoJinjaMakeMessagesCommand):

    def handle(self, *args, **options):
        if options.get('extensions', None) and 'jinja' not in options['extensions']:
            options['extensions'] += ['jinja']
        else:
            options['extensions'] = ['html', 'txt', 'py', 'jinja']
        super(Command, self).handle(*args, **options)
