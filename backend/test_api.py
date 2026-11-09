import sys
from pathlib import Path
BACKEND_DIR = Path(__file__).resolve().parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_all_endpoints():
    print("\n--- 1. Testing Health Endpoint ---")
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health failed: {res.text}"
    print("Health response:", res.json())

    print("\n--- 2. Testing Auth Login (Customer) ---")
    res = client.post("/api/auth/login", json={
        "email": "customer@fredybills.ph",
        "password": "password123",
        "role": "Customer"
    })
    assert res.status_code == 200, f"Login failed: {res.text}"
    customer_token = res.json()["access_token"]
    print("Logged in as:", res.json()["user"]["name"], f"({res.json()['user']['role']})")

    print("\n--- 3. Testing Auth Login (Baker) ---")
    res = client.post("/api/auth/login", json={
        "email": "baker@fredybills.ph",
        "password": "password123",
        "role": "Baker"
    })
    assert res.status_code == 200, f"Baker login failed: {res.text}"
    print("Logged in as:", res.json()["user"]["name"], f"({res.json()['user']['role']})")

    print("\n--- 4. Testing Categories ---")
    res = client.get("/api/categories")
    assert res.status_code == 200
    categories = res.json()
    assert len(categories) >= 5
    print("Found categories:", [c["name"] for c in categories])

    print("\n--- 5. Testing Products Catalog & Filtering ---")
    res = client.get("/api/products?category=cakes")
    assert res.status_code == 200
    cakes = res.json()
    print("Found cakes:", [c["name"] for c in cakes])

    target_id = cakes[0]["id"] if cakes else "classic-chocolate-cake"
    res = client.get(f"/api/products/{target_id}")
    assert res.status_code == 200
    prod_detail = res.json()
    print("Product details:", prod_detail["name"], f"PHP {prod_detail['price']}")

    print("\n--- 6. Testing Promo Code Validation ---")
    res = client.post("/api/promo/validate", json={"code": "FREDY10"})
    assert res.status_code == 200
    promo = res.json()
    assert promo["valid"] is True
    print("Promo FREDY10 result:", promo["name"], f"({promo['discountPercent']}% OFF)")

    print("\n--- 7. Testing Order Creation ---")
    order_payload = {
        "customerName": "Maria Test",
        "customerEmail": "maria@test.ph",
        "customerPhone": "+63 917 999 8888",
        "fulfillmentType": "delivery",
        "address": "Cebu IT Park, Tower 2",
        "paymentMethod": "GCash",
        "items": [
            {
                "id": "p101",
                "name": "Ube Halaya Layer Cake",
                "quantity": 1,
                "price": 1250.0,
                "options": {"size": {"name": "6-inch", "priceDelta": 0}}
            }
        ],
        "subtotal": 1250.0,
        "discount": 125.0,
        "deliveryFee": 0.0,
        "total": 1125.0
    }
    res = client.post("/api/orders", json=order_payload, headers={"Authorization": f"Bearer {customer_token}"})
    assert res.status_code == 200, f"Order creation failed: {res.text}"
    created_order = res.json()
    order_id = created_order["id"]
    print("Created Order ID:", order_id, f"Total: PHP {created_order['total']}")

    print("\n--- 8. Testing Live Order Tracking ---")
    res = client.get(f"/api/orders/{order_id}")
    assert res.status_code == 200
    tracked = res.json()
    print("Tracked Order Status:", tracked["status"], f"Steps: {len(tracked['timeline'])}")

    print("\n--- 9. Testing Order Status Update (e.g. Baker marks Preparing) ---")
    res = client.patch(f"/api/orders/{order_id}/status", json={"status": "preparing"})
    assert res.status_code == 200
    updated = res.json()
    print("Updated Order Status:", updated["status"], f"Step: {updated['statusStep']}")

    print("\n==============================================")
    print(">>> ALL 9 BACKEND API TEST SUITES PASSED 100% SUCCESS! <<<")
    print("==============================================")

if __name__ == "__main__":
    test_all_endpoints()
