from rest_framework import viewsets, permissions
from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-created_at')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
