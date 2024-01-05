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


def get_chat_history(request):
    chat_messages = ChatMessage.objects.all().order_by(
        "-timestamp"
    )  # Assuming you want the newest messages first
    data = [
        {"role": msg.role, "content": msg.content, "timestamp": msg.timestamp}
        for msg in chat_messages
    ]
    return JsonResponse(data, safe=False)
