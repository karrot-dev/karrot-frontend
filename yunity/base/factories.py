from factory import DjangoModelFactory
from yunity.walls.models import Wall as WallModel


class Wall(DjangoModelFactory):
    class Meta:
        model = WallModel

