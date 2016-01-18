from django.db.models import ForeignKey, TextField

from config import settings
from yunity.base.models import BaseModel


class Wall(BaseModel):
    pass


class WallPost(BaseModel):
    wall = ForeignKey(Wall)
    author = ForeignKey(settings.AUTH_USER_MODEL)


class WallPostContent(BaseModel):
    post = ForeignKey(WallPost)
    author = ForeignKey(settings.AUTH_USER_MODEL)
    body = TextField()
