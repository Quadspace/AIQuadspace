from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from chat_app.views import (
    save_chat_message,
    get_thread_ids,
    get_chat_history,
    register,
    check_admin,
)
from django.contrib import admin

urlpatterns = [
    path("api/save_chat_message/", save_chat_message, name="save_chat_message"),
    path("api/thread_ids/", get_thread_ids, name="get_thread_ids"),
    path("api/chat_history/", get_chat_history, name="get_chat_history"),
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/register/", register, name="register"),
    path("api/check_admin/", check_admin, name="check_admin"),
]
