from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from .models import ChatMessage, User, EmailUser
import json
from .forms import SuperuserLoginForm
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["POST"])
def register(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if EmailUser.objects.filter(email=email).exists():
        return Response(
            {"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST
        )
    user = EmailUser.objects.create_user(email=email, password=password)
    return Response(
        {"message": "User created successfully"}, status=status.HTTP_201_CREATED
    )


@csrf_exempt
def superuser_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None and user.is_superuser:
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse(
                {"status": "failure", "message": "Invalid credentials"}, status=401
            )

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)


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
