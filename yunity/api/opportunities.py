from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Opportunities(ApiBase, View):
    def get(self, request):
        """list all opportunities

        """
        raise NotImplementedError

    def post(self, request):
        """create a new opportunity

        """
        raise NotImplementedError


class Opportunity(ApiBase, View):
    def get(self, request, opportunityid):
        """return details about opportunity, including participants

        """
        raise NotImplementedError

    def put(self, request, opportunityid):
        """modify the opportunity

        """
        raise NotImplementedError


class OpportunityWallposts(ApiBase, View):
    def get(self, request, opportunityid):
        """list all messages on the wall

        """
        raise NotImplementedError

    def post(self, request, opportunityid):
        """adds a message to the wall

        """
        raise NotImplementedError


class OpportunityWallpost(ApiBase, View):
    def put(self, request, opportunityid, wallpostid):
        """edit the message

        """
        raise NotImplementedError

    def delete(self, request, opportunityid, wallpostid):
        """delete the message

        """
        raise NotImplementedError


urlpatterns = [
    url(r'/?^$', Opportunities.as_view()),
    url(r'^(?P<opportunityid>[0-9]+)/?$', Opportunity.as_view()),
    url(r'^(?P<opportunityid>[0-9]+)/wallposts/?$', OpportunityWallposts.as_view()),
    url(r'^(?P<opportunityid>[0-9]+)/wallposts/(?P<wallpostid>[0-9]+)/?$', OpportunityWallpost.as_view()),
]
