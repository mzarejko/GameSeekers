from rest_framework import serializers
from .models import Game, City

class GameSerializer(serializers.ModelSerializer):
    publisher_name = serializers.CharField(required=False)
    min_players = serializers.IntegerField(required=False)
    max_players = serializers.IntegerField(required=False)

    class Meta:
        model = Game
        fields = ['id', 'game_name', 'publisher_name', 'min_players', 'max_players']

class CitySerializer(serializers.ModelSerializer):

    class Meta:
        model = City
        fields = ['city_name']
