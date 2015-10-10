from django.conf.urls import include
from django.conf.urls import url

import yunity.api.public.auth
import yunity.api.public.chats
import yunity.api.public.users
import yunity.api.public.search
import yunity.api.public.categories
import yunity.api.public.opportunities
import yunity.api.public.valuables
import yunity.api.public.feedbacks
import yunity.api.public.takes
import yunity.api.public.participates

urlpatterns = [
    url(r'^auth', include(yunity.api.public.auth)),
    url(r'^chats/?', include(yunity.api.public.chats)),
    url(r'^user/?', include(yunity.api.public.users)),
    url(r'^search', include(yunity.api.public.search)),
    url(r'^categories', include(yunity.api.public.categories)),
    url(r'^opportunities', include(yunity.api.public.opportunities)),
    url(r'^valuables', include(yunity.api.public.valuables)),
    url(r'^feedbacks', include(yunity.api.public.feedbacks)),
    url(r'^takes', include(yunity.api.public.takes)),
    url(r'^participates', include(yunity.api.public.participates)),
]
