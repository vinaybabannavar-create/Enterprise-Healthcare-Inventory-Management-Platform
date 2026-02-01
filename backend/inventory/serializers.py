from rest_framework import serializers
from .models import InventoryItem, Supplier, StockTransaction

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class InventoryItemSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    expiry_status = serializers.SerializerMethodField()
    
    class Meta:
        model = InventoryItem
        fields = '__all__'
    
    def get_expiry_status(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        if not obj.expiry_date:
            return 'valid'
        today = timezone.now().date()
        if obj.expiry_date < today:
            return 'expired'
        elif obj.expiry_date < today + timedelta(days=30):
            return 'expiring_soon'
        return 'valid'

class StockTransactionSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source='performed_by.username', read_only=True)
    item_name = serializers.CharField(source='inventory_item.name', read_only=True)

    class Meta:
        model = StockTransaction
        fields = '__all__'
        read_only_fields = ['performed_at', 'previous_quantity', 'new_quantity']
