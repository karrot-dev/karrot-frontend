from django.conf.urls import include
from django.conf.urls import url

import yunity.api.auth
import yunity.api.chats
import yunity.api.users
import yunity.api.search
import yunity.api.categories
import yunity.api.opportunities
import yunity.api.valuables
import yunity.api.feedbacks
import yunity.api.takes
import yunity.api.participates


urlpatterns = [
    url(r'^auth', include(yunity.api.auth)),
    url(r'^chats', include(yunity.api.chats)),
    url(r'^user', include(yunity.api.users)),
    url(r'^search', include(yunity.api.search)),
    url(r'^categories', include(yunity.api.categories)),
    url(r'^opportunities', include(yunity.api.opportunities)),
    url(r'^valuables', include(yunity.api.valuables)),
    url(r'^feedbacks', include(yunity.api.feedbacks)),
    url(r'^takes', include(yunity.api.takes)),
    url(r'^participates', include(yunity.api.participates)),
]
