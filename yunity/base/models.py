from config import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Model, AutoField, Field, DateTimeField, ForeignKey, ManyToManyField, CASCADE, \
    PositiveIntegerField, Manager, CharField
from django.db.models.fields.related import RelatedField
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


class BaseModel(Model):
    class Meta:
        abstract = True

    id = AutoField(primary_key=True)
    created_at = DateTimeField(default=timezone.now)

    def _get_explicit_field_names(self):
        """
        :rtype: list
        """
        return [field.name for field in self._meta.get_fields()
                if isinstance(field, Field) and not isinstance(field, RelatedField)]

    def to_dict(self):
        """
        :rtype: dict
        """
        fields = self._get_explicit_field_names()
        return {field: getattr(self, field) for field in fields if getattr(self, field)}

    def __repr__(self):
        model = str(self.__class__.__name__)
        columns = ', '.join('{}="{}"'.format(field, value) for field, value in self.to_dict().items())
        return '{}({})'.format(model, columns)


class HubManager(Manager):

    use_for_related_fields = True

    def targets_with_content_type(self, model):
        ctype = ContentType.objects.get_for_model(model)
        target_ids = self.filter(target_content_type__id=ctype.id).values_list('target_id')
        return ctype.get_all_objects_for_this_type(id__in=target_ids)


class HubMembership(BaseModel):
    hub = ForeignKey('base.Hub', on_delete=CASCADE)
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)


class Hub(BaseModel):

    target_content_type = ForeignKey(ContentType, on_delete=CASCADE)
    target_id = PositiveIntegerField()
    target = GenericForeignKey('target_content_type', 'target_id')

    class Meta:
        unique_together = ('target_content_type', 'target_id')

    objects = HubManager()

    members = ManyToManyField('users.User', through=HubMembership)


class HubbedMixin:

    @classmethod
    def configure(cls, teams=False, wall=False):
        pass

    @property
    def hub(self):
        ctype = ContentType.objects.get_for_model(self.__class__)
        return Hub.objects.get(target_content_type__id=ctype.id, target_id=self.id)

    @property
    def hub_exists(self):
        ctype = ContentType.objects.get_for_model(self.__class__)
        return Hub.objects.filter(target_content_type__id=ctype.id, target_id=self.id).exists()


# create Hub just after HubModel gets created
@receiver(post_save)
def create_hub_if_not_exists(sender, instance, **kwargs):
    if isinstance(instance, HubbedMixin):
        if not instance.hub_exists:
            Hub.objects.create(target_content_type=ContentType.objects.get_for_model(instance), target_id=instance.id)


class MaxLengthCharField(CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = 255
        super().__init__(*args, **kwargs)
