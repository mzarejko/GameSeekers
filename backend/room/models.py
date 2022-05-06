from django.db import models 
from accounts.models import User 
from django.contrib.postgres.fields import ArrayField
from datetime import datetime
from django.core.validators import MaxValueValidator

class Room(models.Model):
    room_name = models.TextField(max_length=45, primary_key=True)
    members = models.ManyToManyField(User, related_name='room_memebers')
    admin = models.ForeignKey(User, related_name='admin_room', null=True, on_delete=models.SET_NULL)
    maxsize = models.PositiveIntegerField(default=10,
                                          validators=[MaxValueValidator(100)])
    image = models.ImageField(default=None, null=True)


class Message(models.Model):
    author = models.ForeignKey(User, related_name='author_message', null=True, on_delete=models.SET_NULL)
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    @staticmethod    
    def message_to_json(message):
        result = {
            'id': message.id,
            'author': message.author.username,
            'content': message.content,
            'date': str(message.date)[10:16]
        }
        return result

class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)
    room = models.ForeignKey(Room, related_name="room_chat", on_delete=models.CASCADE)
    messages = models.ManyToManyField(Message, blank=True)
    chat_name = models.TextField(max_length=45, default="new chat "+str(chat_id))

    @staticmethod
    def get_last_messasges(chat):
        messages = chat.messages.order_by('-date').all()[:10]
        json_messages = [{'id': message.id,
                          'author': message.author.username,
                          'content': message.content,
                          'date': str(message.date)[10:16]} for message in messages]
        return json_messages
     
