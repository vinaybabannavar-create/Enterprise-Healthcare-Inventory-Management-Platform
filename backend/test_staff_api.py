import requests
import json

# Test the staff-list endpoint
base_url = "http://localhost:8000/api"

# First, let's try to get a token (you'll need valid credentials)
print("Testing Staff List API...")
print("=" * 50)

# Try without authentication first
print("\n1. Testing without authentication:")
try:
    response = requests.get(f"{base_url}/staff-list/")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

# You would need to login first to get a token
# For now, let's just check if the endpoint is reachable
print("\n2. Checking if we need authentication:")
print("The endpoint requires authentication (JWT token)")
print("\nTo test properly, you need to:")
print("1. Login via /api/token/ with username and password")
print("2. Use the access token in the Authorization header")
