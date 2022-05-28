from django.db import models
from django.core.validators import MaxValueValidator

class City(models.Model):
    city_name = models.TextField(max_length=45, primary_key=True)

class Game(models.Model):
    game_name = models.TextField(max_length=45)
    publisher_name = models.TextField(max_length=45, null=True)
    min_players = models.PositiveIntegerField(default=2,
                                              validators=[MaxValueValidator(100)])
    max_players = models.PositiveIntegerField(default=8,
                                              validators=[MaxValueValidator(100)])
