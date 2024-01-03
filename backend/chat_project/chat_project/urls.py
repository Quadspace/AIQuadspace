from django.urls import path
from chat_app.views import save_chat_message

urlpatterns = [
    path("api/save_chat_message/", save_chat_message, name="save_chat_message"),
    # ... other url patterns
]
