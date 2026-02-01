from django.db import models
from django.conf import settings
from inventory.models import InventoryItem, Supplier

class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('ordered', 'Ordered'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    order_number = models.CharField(max_length=100, unique=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateField()
    expected_delivery = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='created_orders')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='approved_orders', blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PO-{self.order_number}"

class OrderItem(models.Model):
    order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.inventory_item.name} for PO-{self.order.order_number}"
