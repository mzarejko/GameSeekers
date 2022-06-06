from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import RoomSerializer, ChatSerializer
from .filter_class import RoomFilter
from .models import Room, Chat
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAdmin, IsNotAdmin, IsMemberOfRoom
from drf_yasg.utils import swagger_auto_schema


class APIRoom(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoomSerializer
    filterset_class = RoomFilter
    queryset = Room.objects.all()

    @swagger_auto_schema(request_body=RoomSerializer,
                         responses={'404': 'user not found',
                                    '200': 'ok',
                                    '400': 'validation error'}
                         )
    def post(self, requset):
        context = {"admin": requset.user}
        serializer = self.serializer_class(data=requset.data, context=context)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'detail': 'Successfully created room'}, status=status.HTTP_200_OK)

class JoinToRoom(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok',
                                    '400': 'room is full'}
                         )
    def patch(self, requset, room_name):
        room = get_object_or_404(Room, room_name=room_name)
        if requset.user in room.members.all():
            return Response({'details': 'You already joined to this group'}, 
                            status = status.HTTP_400_BAD_REQUEST)
        elif room.members.all().count() < room.maxsize:
            room.members.add(requset.user)
            room.save()
            return Response({'detail': 'You joined to room'}, status = status.HTTP_200_OK)
        else:
            return Response({'detail': 'You can\'t join to full room'}, 
                            status = status.HTTP_400_BAD_REQUEST)
 
class LeaveRoom(APIView):
    permission_classes = [IsAuthenticated, IsNotAdmin]

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok',
                                    '400': 'validation error'}
                         )
    def patch(self, requset, room_name):
        room = get_object_or_404(Room, room_name=room_name)
        self.check_object_permissions(self.request, room)
        if requset.user not in room.members.all():
            return Response({'details': 'you are not member of this room'}, 
                            status = status.HTTP_400_BAD_REQUEST)
        else:
            room.members.remove(requset.user)
            room.save()
            return Response({'detail': 'You leaved the room'}, status = status.HTTP_200_OK)


class ManageRoom(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

    def get_permissions(self):
        if self.request.method == 'PATCH':
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok'})
    def delete(self, _, room_name):
        room = get_object_or_404(Room, room_name=room_name)
        self.check_object_permissions(self.request, room)
        room.delete()
        return Response({'detail': 'Room successfully deleted'}, status = status.HTTP_200_OK)

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok'})
    def patch(self, requset, room_name):
        room = get_object_or_404(Room, room_name=room_name)
        self.check_object_permissions(self.request, room)
        context = {"admin": requset.user,
                   "room_name": room}
        serializer = RoomSerializer(room, requset.data, partial=True, context=context)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'detail': 'Room successfully updated'}, status = status.HTTP_200_OK)



class ChatAPI(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsMemberOfRoom]
    serializer_class = ChatSerializer

    def perform_create(self, serializer):
        if Chat.objects.filter(chat_name=self.request.data['chat_name'], 
                                   room=self.kwargs['room_name']).exists():
            return Response({'detail': 'chat with this name already exist in room'},
                            status=status.HTTP_400_BAD_REQUEST)  
        room = Room.objects.get(room_name = self.kwargs["room_name"])
        self.check_object_permissions(self.request, room)
        return serializer.save(room=room,
                               chat_name=self.request.data["chat_name"])

    def get_queryset(self):
        room = Room.objects.get(room_name = self.kwargs["room_name"])
        self.check_object_permissions(self.request, room)
        chats = Chat.objects.filter(room=self.kwargs["room_name"])
        return chats

class ManageChat(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsAdmin]
    serializer_class = ChatSerializer 
    queryset = Chat.objects.all()

    def get_permissions(self):
        if self.request.method == 'PATCH':
            return [IsAuthenticated()]
        return [permission() for permission in self.permission_classes]

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok'})
    def delete(self, _, room_name, chat_id):
        if not Chat.objects.filter(room=room_name, chat_id=chat_id).exists():
            return Response({"detail": "Chat not exists in room"}, status = status.HTTP_404_NOT_FOUND)
        chat = Chat.objects.get(chat_id=chat_id)
        room = Room.objects.get(room_name = room_name)
        self.check_object_permissions(self.request, room)
        chat.delete()
        return Response({'detail': 'Chat successfully deleted'}, status = status.HTTP_200_OK)

    @swagger_auto_schema(responses={'404': 'room not found',
                                    '200': 'ok'})
    def patch(self, requset, room_name, chat_id):
        if not Chat.objects.filter(chat_id=chat_id, 
                                   room=room_name).exists():
            return Response({'detail': 'chat not exists in room'},
                            status=status.HTTP_404_NOT_FOUND)
        chat = Chat.objects.get(chat_id=chat_id)
        room = Room.objects.get(room_name = room_name)
        self.check_object_permissions(self.request, room)
        serializer = ChatSerializer(chat, requset.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'detail': 'Chat successfully updated'}, status = status.HTTP_200_OK)
