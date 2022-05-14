import json 
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import Message, Chat, Game
from accounts.models import User
from django.shortcuts import get_object_or_404
from enum import Enum 


class Commands(str, Enum):
    FETCH_MESSAGES = 'fetch_messages'
    UPDATE_MESSAGES = 'update_messages'
    # FETCH_GAMES = 'fetch_games'

class ChatConsumer(WebsocketConsumer):

    # def fetch_games(self, data):
        # games = Game.get_games(data.get("game_name", ""))
        # content = {
            # 'command': Commands.FETCH_GAMES,
            # 'games': games
        # }
        # self.send(text_data=json.dumps(content))
        
    def fetch_messages(self, data):
        chat = get_object_or_404(Chat, chat_id=data.get("chat_id"))
        messages = Chat.get_last_messasges(chat, self.user)
        content = {
            'command': Commands.FETCH_MESSAGES,
            'messages': messages
        }
        self.send(text_data=json.dumps(content))    

    def new_message(self, data):
        message = data.get("message")
        chat = get_object_or_404(Chat, chat_id = data.get('chat_id'))
        if message:
            message = Message.objects.create(author=self.user,
                                             content=message)
            chat.messages.add(message)
            content = {
                'command': Commands.UPDATE_MESSAGES,
                'message': Message.message_to_json(message, self.user) 
            }
            return self.send_to_chat(content)

    def connect(self):
        self.room = self.scope['url_route']['kwargs']['room_name']
        self.room_group = f'room_{self.room}' 
         
        async_to_sync(self.channel_layer.group_add)(
            self.room_group,
            self.channel_name
        )
        self.user = self.scope["user"]
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)

        if data['command'] == Commands.FETCH_MESSAGES:
            self.fetch_messages(data)
        elif data['command'] == Commands.UPDATE_MESSAGES:
            self.new_message(data)
        # elif data['command'] == Commands.FETCH_GAMES:
            # self.fetch_games(data)
        else:
            raise Exception('Socket received wrong command!')
    
    def send_to_chat(self, message):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group,
            {
                'type': 'chat',
                'content': message
            }
        )

    def chat(self, event):
        message = event['content']
        self.send(text_data=json.dumps(message))
