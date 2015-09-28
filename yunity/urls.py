
from django.conf.urls import include, url

from yunity import views


urlpatterns = [
    url(r'^login/', views.LoginView.as_view()),
    url(r'^register/', views.RegisterView.as_view()),
    url(r'^mappables/new', views.CreateMappableView.as_view()),
    url(r'^mappables/(?P<mappable_id>[0-9]+)', views.GetMappableView.as_view())
]
