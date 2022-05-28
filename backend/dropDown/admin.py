from django.contrib import admin
from .models import Game, City

admin.site.register([Game, City])
