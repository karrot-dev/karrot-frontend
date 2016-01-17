from django.db.models import ForeignKey, TextField

from config import settings
from yunity.base.models import BaseModel


class Wall(BaseModel):
    def resolve_permissions(self, collector):
        h = self.hub
        if h.target_content_type.model == 'group':
            g = h.target
            """:type : Group"""
            collector.add_hub(h, 'read')
            if g.is_content_included_in_parent:
                g = g.parent
                while g:
                    collector.add_hub(g.hub, 'read')
                    g = g.parent


class WallPost(BaseModel):
    wall = ForeignKey(Wall)
    author = ForeignKey(settings.AUTH_USER_MODEL)


class WallPostContent(BaseModel):
    post = ForeignKey(WallPost)
    author = ForeignKey(settings.AUTH_USER_MODEL)
    body = TextField()
