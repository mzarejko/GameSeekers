from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import MeetingSerializer
from .models import Meeting, Room
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAdmin, IsNotAdmin, IsMemberOfRoom
from drf_yasg.utils import swagger_auto_schema

class APIMeeting(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsMemberOfRoom]
    serializer_class = MeetingSerializer

    @swagger_auto_schema(request_body=MeetingSerializer,
                         responses={'404': 'user not found',
                                    '200': 'ok',
                                    '400': 'validation error'}
                         )
    def post(self, request, room_name):
        room = get_object_or_404(Room, room_name = room_name)
        self.check_object_permissions(self.request, room)
        context = {"room": room}
        serializer = self.serializer_class(data=request.data, context=context)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'detail': 'Successfully created meeting'}, status=status.HTTP_200_OK)

    def get_queryset(self):
        room = get_object_or_404(Room, room_name = self.kwargs["room_name"])
        self.check_object_permissions(self.request, room)
        chats = Meeting.objects.filter(room=self.kwargs["room_name"])
        return chats

class ManageMeeting(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsMemberOfRoom]
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok'})
    def delete(self, _, room_name, meeting_id):
        if not Meeting.objects.filter(room=room_name, id=meeting_id).exists():
            return Response({"detail": "Meeting not exists in room"}, status = status.HTTP_404_NOT_FOUND)
        meeting = get_object_or_404(Meeting, id=meeting_id)
        room = Room.objects.get(room_name = room_name)
        self.check_object_permissions(self.request, room)
        meeting.delete()
        return Response({'detail': 'Meeting successfully deleted'}, status = status.HTTP_200_OK)

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok'})
    def patch(self, requset, room_name, meeting_id):
        if not Meeting.objects.filter(id=meeting_id, 
                                   room=room_name).exists():
            return Response({'detail': 'Meeting not exists in room'},
                            status=status.HTTP_404_NOT_FOUND)
        meeting = Meeting.objects.get(id=meeting_id)
        room = Room.objects.get(room_name = room_name)
        self.check_object_permissions(self.request, room)
        context = {"room": room}
        serializer = self.serializer_class(data=requset.data, context=context)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'detail': 'Meeting successfully updated'}, status = status.HTTP_200_OK)



