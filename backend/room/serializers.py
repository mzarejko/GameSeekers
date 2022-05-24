from rest_framework import serializers
from rest_framework.serializers import ValidationError
from .models import Room, Chat, Game, Meeting
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

class GameSerializer(serializers.ModelSerializer):
    publisher_name = serializers.CharField(required=False)
    min_players = serializers.IntegerField(required=False)
    max_players = serializers.IntegerField(required=False)

    class Meta:
        model = Game
        fields = ['game_name', 'publisher_name', 'min_players', 'max_players']

class MeetingSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    meeting_date = serializers.DateField(format="%Y-%m-%d")
    status_value = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        fields = ['id', 'address', 'city', 'meeting_date', 'number_of_participants', 'status_value',
                  'status']
        model = Meeting

    def validate(self, data):
        if data['number_of_participants'] > self.context.get('room').members.count():
            raise ValidationError('number of participants can not be bigger then number of members in room')
        return data

    def create(self, data):
        meeting = Meeting(room=self.context.get("room"),
                          address = data["address"],
                          city=data['city'],
                          meeting_date = data["meeting_date"],
                          number_of_participants = data["number_of_participants"],
                          status = data["status"])
        meeting.save()
        return meeting

    def get_status_value(self, obj):
        return obj.get_status_display()
