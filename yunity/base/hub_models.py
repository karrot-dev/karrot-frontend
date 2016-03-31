from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db.models import Manager, ForeignKey, CASCADE, PositiveIntegerField, ManyToManyField, OneToOneField, \
    BooleanField
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from config import settings
from yunity.base.base_models import BaseModel
from yunity.walls.models import Wall


class HubManager(Manager):

    use_for_related_fields = True

    def targets_with_content_type(self, model):
        ctype = ContentType.objects.get_for_model(model)
        target_ids = self.filter(target_content_type__id=ctype.id).values_list('target_id')
        return ctype.get_all_objects_for_this_type(id__in=target_ids)


class HubMembership(BaseModel):
    hub = ForeignKey('base.Hub', on_delete=CASCADE)
    user = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

    class Meta:
        unique_together = (("hub", "user"),)


class Hub(BaseModel):

    target_content_type = ForeignKey(ContentType, on_delete=CASCADE)
    target_id = PositiveIntegerField()
    target = GenericForeignKey('target_content_type', 'target_id')

    class Meta:
        unique_together = ('target_content_type', 'target_id')

    objects = HubManager()

    members = ManyToManyField(settings.AUTH_USER_MODEL, through=HubMembership)

    wall = OneToOneField(Wall, null=True, on_delete=CASCADE)
    has_wall = BooleanField()


class InitialHubOptions:

    def __init__(self, has_wall=False):
        self.has_wall=has_wall


class HubMixin:

    def __init__(self):
        self._initial_hub_options = getattr(self.__class__, 'DEFAULT_HUB_OPTIONS', InitialHubOptions())

    @property
    def initial_hub_options(self):
        return self._initial_hub_options

    @initial_hub_options.setter
    def initial_hub_options(self, value):
        self._initial_hub_options = value

    @property
    def hub(self):
        ctype = ContentType.objects.get_for_model(self.__class__)
        return Hub.objects.get(target_content_type__id=ctype.id, target_id=self.id)

    @property
    def hub_exists(self):
        ctype = ContentType.objects.get_for_model(self.__class__)
        return Hub.objects.filter(target_content_type__id=ctype.id, target_id=self.id).exists()


@receiver(post_save)
def create_hub_if_not_exists(sender, instance, **kwargs):
    if isinstance(instance, HubMixin):
        if not instance.hub_exists:
            Hub.objects.create(target_content_type=ContentType.objects.get_for_model(instance),
                               target_id=instance.id,
                               has_wall=instance.initial_hub_options.has_wall)


@receiver(pre_save, sender=Hub)
def create_hub_wall(sender, instance, **kwargs):
    if instance.has_wall and not instance.wall_id:
        instance.wall = Wall.objects.create()