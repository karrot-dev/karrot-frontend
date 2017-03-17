from django.urls import reverse
from django.utils import translation
from django.template.backends.jinja2 import Jinja2
from jinja2 import Environment


class FoodsavingJinja2(Jinja2):
    app_dirname = 'templates'


def environment(**options):
    env = Environment(extensions=['jinja2.ext.i18n',], **options)
    env.globals.update({
        'url': reverse,
    })
    env.install_gettext_translations(translation)
    env.install_null_translations()
    return env
