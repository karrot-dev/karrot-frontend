from yunity.models import Chat

assert Chat.objects.count() == 1, 'chat object was not created'
