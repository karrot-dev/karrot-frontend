from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.wamp import ApplicationSession
from utils.session import SharedSessionData


class YunityAuthorizer(ApplicationSession):

    def __init__(self):
        self.s = SharedSessionData(False)

    @inlineCallbacks
    def onJoin(self, details):
        print("MyAuthorizer.onJoin({})".format(details))
        try:
            yield self.register(self.authorize, 'org.yunity.auth')
            print("MyAuthorizer: authorizer registered")
        except Exception as e:
            print("MyAuthorizer: failed to register authorizer procedure ({})".format(e))

    def authorize(self, session, uri, action):
        if action != 'subscribe':
            return False
        if uri.startswith('yunity.public.'):
            return True
        elif uri.startswith('yunity.user.'):
            user = self.s.get_user_by_session(session)
            if user is None:
                return False
            if uri.startswith('yunity.user.' + user + '.'):
                return True

        return False
