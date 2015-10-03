from django.conf.urls import url
from django.views.generic import View
from yunity.utils.api import ApiBase


class Feedbacks(ApiBase, View):
    def get(self, request):
        """list all the feedbacks that this user can see

        """
        raise NotImplementedError

    def post(self, request):
        """create a new feedback

        """
        raise NotImplementedError


class Feedback(ApiBase, View):
    def get(self, request, feedbackid):
        """return the info about the feedback

        """
        raise NotImplementedError

    def put(self, request, feedbackid):
        """modify the status, modify the type or add arbitrator

        """
        raise NotImplementedError


class FeedbackArbitrationlog(ApiBase, View):
    def get(self, feedbackid):
        """show all the messages in this log

        """
        raise NotImplementedError

    def post(self, feedbackid):
        """add a message to the arbiration log

        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Feedbacks.as_view()),
    url(r'^(?P<feedbackid>[0-9]+)/?$', Feedback.as_view()),
    url(r'^(?P<feedbackid>[0-9]+)/arbitrationlog/?$', FeedbackArbitrationlog.as_view()),
]
