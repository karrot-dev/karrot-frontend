from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View
from yunity.api.ids import feedback_id_uri_pattern

from yunity.api.utils import ApiBase


class Feedbacks(ApiBase, View):
    def get(self, request):
        """list all the feedbacks that this user can see

        :type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """create a new feedback

        :type request: HttpRequest
        """
        raise NotImplementedError


class Feedback(ApiBase, View):
    def get(self, request, feedbackid):
        """return the info about the feedback

        :type request: HttpRequest
        :type feedbackid: int
        """
        raise NotImplementedError

    def put(self, request, feedbackid):
        """modify the status, modify the type or add arbitrator

        :type request: HttpRequest
        :type feedbackid: int
        """
        raise NotImplementedError


class FeedbackArbitrationlog(ApiBase, View):
    def get(self, request, feedbackid):
        """show all the messages in this log

        :type request: HttpRequest
        :type feedbackid: int
        """
        raise NotImplementedError

    def post(self, request, feedbackid):
        """add a message to the arbiration log

        :type request: HttpRequest
        :type feedbackid: int
        """
        raise NotImplementedError


urlpatterns = [
    url(r'^/?$', Feedbacks.as_view()),
    url(r'^{feedbackid}/?$'.format(feedbackid=feedback_id_uri_pattern), Feedback.as_view()),
    url(r'^{feedbackid}/arbitrationlog/?$'.format(feedbackid=feedback_id_uri_pattern), FeedbackArbitrationlog.as_view()),
]
