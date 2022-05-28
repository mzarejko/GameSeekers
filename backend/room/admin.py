from django.contrib import admin
from .models import Room, Chat, Message, Meeting

admin.site.register([Room, Chat, Message, Meeting])
