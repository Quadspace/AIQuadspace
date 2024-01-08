from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ChatMessage, User
import json


@csrf_exempt
def save_chat_message(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_name = data.get("name")

        if user_name:
            user, created = User.objects.get_or_create(name=user_name)
        else:
            return JsonResponse(
                {"status": "error", "message": "User name is required"}, status=400
            )

        ChatMessage.objects.create(
            user=user, role=data["role"], content=data["content"]
        )
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)
