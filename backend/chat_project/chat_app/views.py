from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from .models import ChatMessage, User, EmailUser, SuperuserCredentials
import json
from .forms import SuperuserLoginForm
from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)


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


@api_view(["GET"])
def check_admin(request):
    # Ensure the user is authenticated
    if request.user.is_authenticated:
        # Check if the user is an admin
        admin_status = getattr(request.user, "is_admin", False)
    else:
        admin_status = False

    logger.info(f"User: {request.user}, Is Admin: {admin_status}")

    # Return the admin status
    return JsonResponse({"isAdmin": admin_status})


@api_view(["POST"])
def superuser_login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        superuser = SuperuserCredentials.objects.get(username=username)
        if check_password(password, superuser.password_hash):
            return JsonResponse({"status": "success"})
        else:
            return JsonResponse(
                {"status": "failure", "message": "Invalid credentials"}, status=401
            )
    except SuperuserCredentials.DoesNotExist:
        return JsonResponse(
            {"status": "failure", "message": "User not found"}, status=404
        )


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
