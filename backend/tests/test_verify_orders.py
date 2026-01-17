import pytest
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_verify_orders(client):
    timestamp = int(datetime.now().timestamp())
    email = f"test_{timestamp}@example.com"
    username = f"test_user_{timestamp}"
    password = "testpassword"

    reg_response = await client.post(
        "/register",
        json={
            "email": email,
            "user_name": username,
            "password": password,
            "role": "cli",
            "phone_number": "123456789",
        },
    )

    if reg_response.status_code != 200:
        print(f"Registration failed: {reg_response.text}")
        return

    login_response = await client.post(
        "/token", data={"username": email, "password": password}
    )

    if login_response.status_code != 200:
        print(f"Login failed: {login_response.text}")
        return

    deadline = (datetime.now() + timedelta(days=30)).isoformat()

    order_payload = {
        "name": "Test Order Multi Service",
        "description": "Testing order creation with multiple services",
        "location": "Test Location",
        "raid_date": True,
        "completion_date": False,
        "deadline": deadline,
        "services": [
            {
                "service_name": "Ortofotomapa",
                "parameters": {"Rozdzielczość": "10", "Dokładność": "5"},
            },
            {
                "service_name": "Chmura Punktów",
                "parameters": {"Dokładność": "5", "Format": "LAS"},
            },
        ],
    }

    order_response = await client.post("/orders", json=order_payload)

    if order_response.status_code != 200:
        print(f"Order creation failed: {order_response.text}")
    else:
        print("Order created successfully!")
        print(order_response.json())
