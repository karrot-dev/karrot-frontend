from django.conf import settings
import redis, json


class RealtimeClientMiddleware(object):
    def process_request(self, request):
        return None

    def process_response(self, request, response):
        """ Updates session data in RealtimeClient Server
        :param request:
        :param response:
        :return:
        """
        if request.user.is_authenticated():
            if request.session.modified:
                RealtimeClientData.set_user_session(request.session.session_key)
        else:
            RealtimeClientData.destroy_user_session(request.session.session_key)
        return response


class RealtimeClientData(object):
    PREFIX = 'session-store'
    USER_NOTIFICATION_CHANNEL = 'notifications'
    r = None

    @classmethod
    def redis_connect(cls, use_django_redis_connection=True):
        if use_django_redis_connection:
            from django_redis import get_redis_connection
            cls.r = get_redis_connection("default")
        else:
            cls.r = redis.StrictRedis(host='localhost', port=6379, db=0)

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
    def send_to_users(cls, userids, data):
        """
        :param userids: list of userids to send the data to
        :param data: dictionary that will be json encoded and send to each user
        :return:
        """
        cls.connect()
        cls.r.publish('notifications', '{{"users" : [{}], "data": {}}}'.format(','.join(map(str, userids)), json.dumps(data)))
