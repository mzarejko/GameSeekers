from django_filters import rest_framework as filters
from .models import Game, City

class GameFilter(filters.FilterSet):
    class Meta:
        model = Game
        fields = ['game_name', 'publisher_name', 'min_players', 'max_players']
