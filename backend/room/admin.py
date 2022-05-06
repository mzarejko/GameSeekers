from django.contrib import admin
from .models import Room, Chat, Message

admin.site.register([Room, Chat, Message])
