
from django.views.generic import View
from django.shortcuts import render

import logging

from yunity.utils.api import ApiBase

# Get an instance of a logger
logger = logging.getLogger(__name__)

import crossbarconnect
from datetime import datetime
from django.http import HttpResponse
from yunity.models import Chat, Message, User

class ChatView(ApiBase, View):

    def _serialize_message(self, msg):
        msg = msg.to_dict()
        return {"sender": msg['sender'].id,
                "type": msg['type'],
                "content": msg['content'],
                "createdAt": msg['createdAt']}

    def get(self, request):
        "get history for chatid"

        id = request.GET['id']
        data = Chat.objects.get(id=id).messages.all()

        return self.json_response([self._serialize_message(x) for x in data])

    def _check_request(self, req_post):
        if any([(x not in req_post) for x in ['id', 'type', 'content']]):
            return False

        json = {'id': req_post['id'],
                'type': req_post['type'],
                'content': req_post['content'],
                'sender': 1,
                'timestamp': datetime.now().isoformat(),
                }
        return json

    def post(self, request):
        "add a new message to chat"

        json = self._check_request(request.POST)
        if json:
            msg_type = Message.TYPE.TEXT
            if json['type'] != "TEXT":
                raise Exception("Unknown message type")

            m = Message.objects.create(
                sender=User.objects.get(id=json['sender']),
                content=json['content'],
                type=msg_type,
                createdAt=json['timestamp']
            )
            Chat.objects.get(id=json['id']).messages.add(m)

            client = crossbarconnect.Client("http://127.0.0.1:8081/publish")
            client.publish("yunity.public.chat.%s" % json['id'], json)
            return HttpResponse(status=201)
        return HttpResponse(status=404)



def chat_demo(request, chatid):
    'TODO: remove template'
    return render(request, 'chat.html', {'chatid': chatid})