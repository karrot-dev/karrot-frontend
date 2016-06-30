from django.contrib.auth import get_user_model
from django.db.models import ForeignKey, TextField

from config import settings
from yunity.base.base_models import BaseModel


class Wall(BaseModel):
    pass


class WallPost(BaseModel):
    wall = ForeignKey(Wall)
    author = ForeignKey(get_user_model())


class WallPostContent(BaseModel):
    post = ForeignKey(WallPost)
    author = ForeignKey(get_user_model())
    body = TextField()
