from django.db import models
from django.conf import settings
from inventory.models import InventoryItem

class Alert(models.Model):
    TYPE_CHOICES = [
        ('low_stock', 'Low Stock'),
        ('expiry', 'Expiry'),
        ('order', 'Order Status'),
        ('system', 'System'),
    ]
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    message = models.TextField()
    related_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.type} - {self.severity}: {self.message[:50]}"
