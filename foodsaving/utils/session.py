from django.conf import settings
from redis import StrictRedis

from foodsaving.utils.misc import json_stringify


class RealtimeClientMiddleware(object):

    @staticmethod
    def process_request(request):
        return None

    @staticmethod
    def process_response(request, response):
        """ Updates session data in RealtimeClient Server
        :param request:
        :param response:
        :return:
        """
        if request.user.is_authenticated():
            if request.session.modified:
                RealtimeClientData.set_user_session(request.session.session_key, request.user.id)
        else:
            RealtimeClientData.destroy_user_session(request.session.session_key)
        return response


class RealtimeClientData(object):
    PREFIX = 'session-store'
    USER_NOTIFICATION_CHANNEL = 'notifications'

    class Types(object):
        CONVERSATION_MESSAGE = 'conversation_message'

    r = None

    @classmethod
    def redis_connect(cls, use_django_redis_connection=True):
        """ Connect to redis. Will be done automatically on first request.
        :param use_django_redis_connection: Set to true if redis caching backend is used in Django so a connection
        can be shared. False otherwise
        :return:
        """
        establish_own_connection = not use_django_redis_connection
        if use_django_redis_connection:
            try:
                from django_redis import get_redis_connection
                cls.r = get_redis_connection("default")
            except:
                establish_own_connection = True
        if establish_own_connection:
            cls.r = StrictRedis(host='localhost', port=6379, db=0)

    @classmethod
    def connect(cls):
        if cls.r is None:
            cls.redis_connect(True)
        return cls.r

    @classmethod
    def session_key(cls, session):
        return '{prefix}-{session}'.format(prefix=cls.PREFIX, session=session)

    @classmethod
    def get_user_by_session(cls, session):
        cls.connect()
        user = cls.r.get(cls.session_key(session))
        try:
            return user.decode()
        except Exception as e:
            return None

    @classmethod
    def set_user_session(cls, session, userid):
        cls.connect()
        cls.r.setex(cls.session_key(session), settings.SESSION_COOKIE_AGE, userid)

    @classmethod
    def destroy_user_session(cls, session):
        cls.connect()
        cls.r.delete(cls.session_key(session))

    @classmethod
    def send_to_users(cls, userids, pl_type, payload):
        """
        :param userids: list of userids to send the data to
        :param pl_type: Type of the payload as an arbitrary string
        :param payload: dictionary that will be json encoded and send to each user
        :return:
        """
        cls.connect()
        data = {"users": userids,
                "type": pl_type,
                "payload": payload}
        cls.r.publish('notifications', json_stringify(data))
