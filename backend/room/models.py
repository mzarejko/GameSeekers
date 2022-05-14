from django.db import models 
from accounts.models import User 
from django.core.validators import MaxValueValidator
import requests
import xmltodict

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
    def message_to_json(message, user):
        result = {
            'id': message.id,
            'left': (message.author == user),
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
    def get_last_messasges(chat, user):
        messages = chat.messages.order_by('-date').all()[:10]
        json_messages = [{'id': message.id,
                          'left': (message.author == user),
                          'author': message.author.username,
                          'content': message.content,
                          'date': str(message.date)[10:16]} for message in messages]
        return json_messages
     
class Game(models.Model):
    game_name = models.TextField(max_length=45)
    publisher_name = models.TextField(max_length=45, null=True)
    min_players = models.PositiveIntegerField(default=2,
                                              validators=[MaxValueValidator(100)])
    max_players = models.PositiveIntegerField(default=8,
                                              validators=[MaxValueValidator(100)])
    @staticmethod
    def get_games(data):
        base = 'https://api.geekdo.com/xmlapi/boardgame/'
        xml = requests.get(base+data['game_name'])
        if xml.status_code == 200:
            doc = xmltodict.parse(xml.text)
            games = {}
            if 'boardgame' in doc.keys():
                for obj in doc['boardgames']['boardgame']:
                    name = obj["name"]
                    if type(name) is dict:
                        if "@primary" in name.keys():
                            games[name['#text']] = {"id": obj["@objectid"],
                                                    "year": obj["yearpublished"]}
                    else:
                        games[name] = {"id": obj["@objectid"],
                                        "year": obj["yearpublished"]}
            return games

class City(models.Model):
    city_name = models.TextField(max_length=45, null=True)


class Meeting(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    address = models.TextField(max_length=45, null=True)
    city = models.ForeignKey(City, on_delete=models.PROTECT)
    meeting_date = models.DateTimeField(auto_now_add=True, null=True)
    number_of_participants = models.PositiveIntegerField(default=2,
                                                         validators=[MaxValueValidator(100)])


class MeetingStatus(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    status = [
        ('Ca', 'Canceled'),
        ('Fn', 'Finished'),
        ('OG', 'Ongoing'),
        ('SH', 'Scheduled'),
    ]
