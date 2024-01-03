from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ChatMessage
import json


@csrf_exempt  # Only for development, CSRF protection should be enabled for production
def save_chat_message(request):
    if request.method == "POST":
        data = json.loads(request.body)
        ChatMessage.objects.create(role=data["role"], content=data["content"])
        return JsonResponse({"status": "success"})
    return JsonResponse({"status": "error"}, status=400)
