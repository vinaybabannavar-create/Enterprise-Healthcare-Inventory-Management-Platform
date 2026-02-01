from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import InventoryItem, Supplier, StockTransaction
from .serializers import InventoryItemSerializer, SupplierSerializer, StockTransactionSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    permission_classes = [permissions.IsAuthenticated]

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        items = self.get_queryset().filter(quantity__lt=F('minimum_stock'))
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        item = self.get_object()
        quantity_change = request.data.get('quantity_change')
        transaction_type = request.data.get('transaction_type', 'adjust')
        notes = request.data.get('notes', '')

        if quantity_change is None:
            return Response({'error': 'quantity_change is required'}, status=status.HTTP_400_BAD_REQUEST)

        previous_quantity = item.quantity
        item.quantity += int(quantity_change)
        item.save()

        StockTransaction.objects.create(
            inventory_item=item,
            transaction_type=transaction_type,
            quantity_change=quantity_change,
            previous_quantity=previous_quantity,
            new_quantity=item.quantity,
            notes=notes,
            performed_by=request.user
        )

        return Response(self.get_serializer(item).data)

class StockTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockTransaction.objects.all().order_by('-performed_at')
    serializer_class = StockTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
