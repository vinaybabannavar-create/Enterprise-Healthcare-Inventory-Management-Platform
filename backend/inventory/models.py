from django.db import models
from django.conf import settings

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    rating = models.IntegerField(default=3)

    def __str__(self):
        return self.name

class InventoryItem(models.Model):
    CATEGORY_CHOICES = [
        ('medicine', 'Medicine'),
        ('equipment', 'Equipment'),
        ('consumable', 'Consumable'),
    ]
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    sku = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES)
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=50) # Pieces, Boxes, etc.
    minimum_stock = models.IntegerField(default=10)
    maximum_stock = models.IntegerField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    batch_number = models.CharField(max_length=100, blank=True, null=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, related_name='items')
    location = models.CharField(max_length=255, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_restocked = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"

class StockTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('restock', 'Restock'),
        ('consume', 'Consume'),
        ('adjust', 'Adjust'),
        ('transfer', 'Transfer'),
        ('expired', 'Expired'),
    ]
    inventory_item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=50, choices=TRANSACTION_TYPES)
    quantity_change = models.IntegerField() # Negative for consumption
    previous_quantity = models.IntegerField()
    new_quantity = models.IntegerField()
    notes = models.TextField(blank=True, null=True)
    performed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    performed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.inventory_item.name} - {self.transaction_type} ({self.quantity_change})"
