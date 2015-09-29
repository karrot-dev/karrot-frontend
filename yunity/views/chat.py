
from django.views.generic import View
from django.shortcuts import render

import logging

from yunity.utils.api import ApiBase

# Get an instance of a logger
logger = logging.getLogger(__name__)


class GetChatView(ApiBase, View):

    def get(self, request, chatid):
        'TODO: remove'
        return render(request, 'chat.html', {'chatid': chatid})

import crossbarconnect
from datetime import datetime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def post_chat_view(request):
    json = {}
    json.update(request.POST)
    id = request.POST.get('id', '')
    json['timestamp'] = datetime.now().isoformat()
    client = crossbarconnect.Client("http://127.0.0.1:8080/publish")
    client.publish("chat.%s" % id, json)
    return HttpResponse()