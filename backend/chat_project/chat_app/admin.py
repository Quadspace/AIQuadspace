from django.contrib import admin
from .models import ChatMessage, EmailUser

admin.site.register(ChatMessage)
admin.site.register(EmailUser)
