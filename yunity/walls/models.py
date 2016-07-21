from django.db.models import ForeignKey, TextField

from config import settings
from yunity.base.base_models import BaseModel
from django.db import models


class Wall(BaseModel):
    pass


class WallPost(BaseModel):
    wall = ForeignKey(Wall, on_delete=models.CASCADE)
    author = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class WallPostContent(BaseModel):
    post = ForeignKey(WallPost, on_delete=models.CASCADE)
    author = ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = TextField()
