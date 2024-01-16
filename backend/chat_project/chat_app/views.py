from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from .models import ChatMessage, EmailUser
import json

from django.contrib import messages
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
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
    if request.user.is_authenticated:
        return Response({"isAdmin": request.user.is_admin})
    return Response({"isAdmin": False}, status=status.HTTP_403_FORBIDDEN)


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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_chat_message(request):
    try:
        data = request.data
        email = data.get("userEmail")
        content = data.get("content")
        role = data.get("role")

        if not email or not content or not role:
            return JsonResponse(
                {"status": "error", "message": "Missing required fields"}, status=400
            )

        user = EmailUser.objects.get(email=email)
        ChatMessage.objects.create(user=user, role=role, content=content)
        return JsonResponse({"status": "success"})

    except EmailUser.DoesNotExist:
        return JsonResponse(
            {"status": "error", "message": "User not found"}, status=404
        )
    except Exception as e:
        logger.error(f"Error saving chat message: {e}")
        return JsonResponse(
            {"status": "error", "message": "Internal server error"}, status=500
        )
