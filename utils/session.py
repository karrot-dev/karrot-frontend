import redis


class SharedSessionData():
    PREFIX = 'session-store'

    def __init__(self, use_django_redis_connection=False):
        if use_django_redis_connection:
            from django_redis import get_redis_connection
            self.r = get_redis_connection("default")
        else:
            self.r = redis.StrictRedis(host='localhost', port=6379, db=0)

    def session_key(self, session):
        return (self.PREFIX + '-' + str(session))

    def get_user_by_session(self, session):
        user = self.r.get(self.session_key(session))
        try:
            return user.decode()
        except Exception as e:
            return None

    def set_user_session(self, session, userid):
        self.r.set(self.session_key(session), userid)
