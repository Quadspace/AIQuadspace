from django.urls import path
from chat_app.views import save_chat_message
from django.contrib import admin

urlpatterns = [
    path("api/save_chat_message/", save_chat_message, name="save_chat_message"),
    # path("api/chat_history/", get_chat_history, name="get_chat_history"),
    path("admin/", admin.site.urls),
    # ... other url patterns
]
