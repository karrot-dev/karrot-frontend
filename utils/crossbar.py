from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.wamp import ApplicationSession


class YunityAuthorizer(ApplicationSession):
    @inlineCallbacks
    def onJoin(self, details):
        print("MyAuthorizer.onJoin({})".format(details))
        try:
            yield self.register(self.authorize, 'org.yunity.auth')
            print("MyAuthorizer: authorizer registered")
        except Exception as e:
            print("MyAuthorizer: failed to register authorizer procedure ({})".format(e))

    def authorize(self, session, uri, action):
        return True
