def ws_connect(message):
    message.reply_channel.send({
        "text": "welcome to websockets!",
    })


def ws_message(message):
    message.reply_channel.send({
        "text": "you said: " + message.content['text'],
    })