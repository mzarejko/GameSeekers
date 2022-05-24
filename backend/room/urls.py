from django.urls import path
from . import roomViews, gameViews 

urlpatterns = [
    path('', roomViews.APIRoom.as_view(), name='api-room'),
    path('<str:room_name>/join', roomViews.JoinToRoom.as_view(), name='join'),
    path('<str:room_name>/leave', roomViews.LeaveRoom.as_view(), name='leave'),
    path('<str:room_name>/', roomViews.ManageRoom.as_view(), name='manage-room'),
    path('<str:room_name>/chat/', roomViews.ChatAPI.as_view(), name='api-chat'),
    path('<str:room_name>/chat/<int:chat_id>/', roomViews.ManageChat.as_view(), name='manage-chat'),
    path('<str:room_name>/meeting/', gameViews.APIMeeting.as_view(), name='meeting-api'),
    path('<str:room_name>/meeting/<int:meeting_id>/', gameViews.ManageMeeting.as_view(),
         name='manage-meeting'),
]
