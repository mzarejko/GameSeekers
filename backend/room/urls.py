from django.urls import path
from . import views 

urlpatterns = [
    path('', views.APIRoom.as_view(), name='api-room'),
    path('<str:room_name>/join', views.JoinToRoom.as_view(), name='join'),
    path('<str:room_name>/leave', views.LeaveRoom.as_view(), name='leave'),
    path('<str:room_name>/', views.ManageRoom.as_view(), name='manage-room'),
    path('<str:room_name>/chat/', views.ChatAPI.as_view(), name='manage-chat'),
]
