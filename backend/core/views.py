import os
from django.http import JsonResponse, StreamingHttpResponse
import json
import asyncio
import random
from datetime import datetime

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny

def api_root_view(request):
    return JsonResponse({
        "name": "HealthStock Enterprise API",
        "version": "1.0.0",
        "status": "Running",
        "endpoints": {
            "api": "/api/",
            "admin": "/admin/",
            "alerts_stream": "/api/alerts/stream/",
            "analytics_live": "/api/analytics/live/",
            "warehouses_live": "/api/warehouses/live/"
        },
        "message": "Welcome to the HealthStock Backend. Visit port 3000 for the user interface."
    })

@csrf_exempt
async def alert_stream(request):
    async def event_stream():
        # Mocking an alert stream
        while True:
            if random.random() > 0.8:  # 20% chance to send an alert every 2 seconds
                alert = {
                    "id": random.randint(100, 999),
                    "itemName": random.choice(["Paracetamol", "N95 Masks", "Surgical Gloves", "Oxygen Tank"]),
                    "message": "Stock level is below threshold",
                    "severity": "high",
                    "timestamp": datetime.now().isoformat()
                }
                yield f"data: {json.dumps(alert)}\n\n"
            await asyncio.sleep(2)
    
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'
    return response

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def warehouses_live(request):
    # Mock warehouse data
    warehouses = [
        {"id": 1, "name": "Main Warehouse", "lat": 40.7128, "lng": -74.0060, "stockLevel": random.randint(20, 100), "status": "active"},
        {"id": 2, "name": "East Wing Storage", "lat": 34.0522, "lng": -118.2437, "stockLevel": random.randint(10, 60), "status": "critical"},
        {"id": 3, "name": "Downtown Pharmacy", "lat": 41.8781, "lng": -87.6298, "stockLevel": random.randint(40, 90), "status": "active"},
    ]
    return JsonResponse(warehouses, safe=False)

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def ai_query(request):
    data = request.data # DRF handles JSON parsing
    question = data.get('question', '').lower()
    
    # Simple rule-based AI responses
    answer = "I'm analyzing the inventory data..."
    if "low stock" in question:
        answer = "Currently, there are 3 items with critical stock levels: N95 Masks, Surgical Gloves, and Insulin."
    elif "expiring" in question:
        answer = "You have 8 batches of antibiotics expiring within the next 7 days in Warehouse A."
    elif "restock" in question:
        answer = "I recommend restocking Paracetamol 500mg immediately as demand has spiked by 15% this week."
    elif "hi" in question or "hello" in question:
        answer = "Hello! I am your AI assistant. I can help you with stock levels, expiry dates, and restock recommendations. What can I do for you?"
        
    return JsonResponse({"answer": answer})

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def stock_forecast(request):
    # Mock ML predictions
    predictions = {
        "demandChange": random.randint(-10, 25),
        "stockoutRisk": random.choice(["low", "medium", "high"]),
        "recommendation": "Increase order volume for seasonal vaccines by 20."
    }
    return JsonResponse(predictions)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def metrics_live(request):
    data = {
        "time": datetime.now().strftime("%H:%M:%S"),
        "incomingOrders": random.randint(5, 20),
        "stockOuts": random.randint(0, 5),
        "expiryEvents": random.randint(0, 2)
    }
    return JsonResponse(data)
