from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('inventory_manager', 'Inventory Manager'),
        ('procurement', 'Procurement'),
        ('staff', 'Hospital Staff'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='staff')
    hospital_name = models.CharField(max_length=255, blank=True, null=True)
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.email} - {self.role}"
