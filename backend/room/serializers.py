from rest_framework import serializers
from rest_framework.serializers import ValidationError
from .models import Room, Chat
from accounts.serializers import UserSerializer
from accounts.models import User
from django.shortcuts import get_object_or_404

class RoomSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, required=False)
    admin = serializers.SerializerMethodField(read_only=True)
    available = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Room
        fields = ['room_name', 'maxsize', 'members', 'admin', 'available']

    def validate(self, data):
        room = self.context.get("room_name")
        if data.get('members'):
            if room:
                if len(data['members']) + 1 > data.get("maxsize", room.maxsize):
                    raise ValidationError('size of room smaller then count of members')
            else:
                if len(data['members']) + 1 > data["maxsize"]:
                    raise ValidationError('size of room smaller then count of members')

        return data

    def update(self, instance, data):
        instance.room_name = data.get("room_name", instance.room_name)
        instance.maxsize = data.get("maxsize", instance.maxsize)
        if 'members' in data.keys():
            instance.members.clear()
            instance.members.add(self.context.get("admin"))
            for member in data['members']:
                user = get_object_or_404(User, username=member['username'])
                instance.members.add(user)
        instance.save()
        return instance

    def create(self, data):
        room = Room(room_name=data.get('room_name'), maxsize=data.get('maxsize'),
                    admin=self.context.get("admin"))
        room.save()
        if 'members' in data.keys():
            for member in data['members']:
                user = get_object_or_404(User, username=member['username'])
                room.members.add(user)
            
        room.members.add(self.context.get("admin"))
        room.save()
        return room

    def get_available(self, room):
        return room.maxsize - len(room.members.all())

    def get_admin(self, room):
        return room.admin.username

class ChatSerializer(serializers.ModelSerializer):
    chat_name = serializers.CharField(required=False)
    chat_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Chat
        fields = ['chat_name', 'chat_id']
