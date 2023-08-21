from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Note(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='notes')
    body = models.TextField()

    def __str__(self):
        return self.body
