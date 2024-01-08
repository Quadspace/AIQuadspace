from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100, unique=True)
    session_id = models.CharField(
        max_length=100, unique=True, null=True
    )  # Optional, for tracking sessions

    def __str__(self):
        return self.name


class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
    role = models.CharField(
        max_length=10, choices=[("user", "User"), ("assistant", "Assistant")]
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."
