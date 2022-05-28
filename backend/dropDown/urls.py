from django.urls import path
from . import views

urlpatterns = [
    path('game/', views.APIGame.as_view(), name='api-game'),
    path('city/', views.APICity.as_view(), name='api-game'),
]
