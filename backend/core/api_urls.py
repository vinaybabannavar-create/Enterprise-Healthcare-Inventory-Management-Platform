from django.urls import path, include
from rest_framework.routers import DefaultRouter
from inventory.views import InventoryItemViewSet, SupplierViewSet, StockTransactionViewSet
from orders.views import PurchaseOrderViewSet
from users.views import RegisterView, UserProfileView, StaffListView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'inventory', InventoryItemViewSet)
router.register(r'suppliers', SupplierViewSet)
router.register(r'transactions', StockTransactionViewSet)
router.register(r'orders', PurchaseOrderViewSet)

from .views import alert_stream, warehouses_live, ai_query, stock_forecast, metrics_live

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('staff-list/', StaffListView.as_view(), name='staff-list'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('alerts/stream/', alert_stream, name='alerts-stream'),
    path('warehouses/live/', warehouses_live, name='warehouses-live'),
    path('ai/query/', ai_query, name='ai-query'),
    path('predictions/stock-forecast/', stock_forecast, name='stock-forecast'),
    path('metrics/live/', metrics_live, name='metrics-live'),
]
