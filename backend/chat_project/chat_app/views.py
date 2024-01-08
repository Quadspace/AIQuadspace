from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ChatMessage, User
import json


def get_thread_ids(request):
    thread_ids = User.objects.values_list("name", flat=True).distinct()
    return JsonResponse(list(thread_ids), safe=False)


def get_chat_history(request):
    thread_id = request.GET.get("thread_id")
    if thread_id:
        user = User.objects.get(name=thread_id)
        chat_messages = ChatMessage.objects.filter(user=user).order_by("timestamp")
        data = [
            {"role": msg.role, "content": msg.content, "timestamp": msg.timestamp}
            for msg in chat_messages
        ]
        return JsonResponse(data, safe=False)
    return JsonResponse(
        {"status": "error", "message": "Thread ID is required"}, status=400
    )


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
