from rest_framework import serializers
from .models import PurchaseOrder, OrderItem
from inventory.models import InventoryItem, Supplier

class OrderItemSerializer(serializers.ModelSerializer):
    inventory_item_name = serializers.ReadOnlyField(source='inventory_item.name')
    inventory_item_sku = serializers.ReadOnlyField(source='inventory_item.sku')

    class Meta:
        model = OrderItem
        fields = ('id', 'inventory_item', 'inventory_item_name', 'inventory_item_sku', 'quantity', 'unit_price', 'total_price')
        read_only_fields = ('total_price',)

class PurchaseOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    supplier_name = serializers.ReadOnlyField(source='supplier.name')
    created_by_name = serializers.ReadOnlyField(source='created_by.username')
    approved_by_name = serializers.ReadOnlyField(source='approved_by.username')

    class Meta:
        model = PurchaseOrder
        fields = (
            'id', 'order_number', 'supplier', 'supplier_name', 'order_date', 
            'expected_delivery', 'status', 'total_amount', 'created_by', 
            'created_by_name', 'approved_by', 'approved_by_name', 'notes', 
            'items', 'created_at', 'updated_at'
        )
        read_only_fields = ('created_by', 'approved_by', 'total_amount', 'created_at', 'updated_at')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        purchase_order = PurchaseOrder.objects.create(**validated_data)
        total_amount = 0
        for item_data in items_data:
            item = OrderItem.objects.create(order=purchase_order, **item_data)
            total_amount += item.total_price
        
        purchase_order.total_amount = total_amount
        purchase_order.save()
        return purchase_order
