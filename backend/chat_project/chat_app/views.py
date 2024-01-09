from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from .models import ChatMessage, User
import json
from .forms import SuperuserLoginForm
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


@csrf_exempt
def superuser_login(request):
    if request.method == "POST":
        form = SuperuserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]

            # Authenticate user
            user = authenticate(username=username, password=password)
            if user is not None and user.is_superuser:
                # Generate token
                refresh = RefreshToken.for_user(user)
                return JsonResponse(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                )
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)
        else:
            return JsonResponse({"error": "Invalid form input"}, status=400)
    else:
        form = SuperuserLoginForm()
        return render(request, "superuser_login.html", {"form": form})


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
