from django.db.models import CharField


class MaxLengthCharField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        super().__init__(*args, **kwargs)