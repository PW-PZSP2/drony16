import pytest
import httpx
from datetime import datetime, timedelta
import asyncio

BASE_URL = "http://localhost:8080"


@pytest.mark.asyncio
async def test_order_completion_flow():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        timestamp = int(datetime.now().timestamp())
        client_email = f"client_{timestamp}@example.com"
        operator_email = f"operator_{timestamp}@example.com"
        password = "testpassword"

        res = await client.post(
            "/register",
            json={
                "email": client_email,
                "user_name": f"client_{timestamp}",
                "password": password,
                "role": "cli",
                "phone_number": "123123123",
            },
        )
        assert res.status_code == 200, f"Client reg failed: {res.text}"

        res = await client.post(
            "/register",
            json={
                "email": operator_email,
                "user_name": f"operator_{timestamp}",
                "password": password,
                "role": "ope",
                "phone_number": "456456456",
                "localisation": "Warsaw",
                "area": 100,
            },
        )
        assert res.status_code == 200, f"Operator reg failed: {res.text}"
        operator_id = res.json()["user_id"]

        res = await client.post(
            "/token", data={"username": client_email, "password": password}
        )
        assert res.status_code == 200
        client_token = res.cookies["access_token"]

        deadline = (datetime.now() + timedelta(days=30)).isoformat()
        order_payload = {
            "name": "Completion Test Order",
            "description": "Testing completion flow",
            "location": "Warsaw",
            "raid_date": True,
            "completion_date": False,
            "deadline": deadline,
            "services": [
                {
                    "service_name": "Ortofotomapa",
                    "parameters": {"Rozdzielczość": "10", "Dokładność": "5"},
                }
            ],
        }
        res = await client.post(
            "/orders",
            json=order_payload,
            headers={"Cookie": f"access_token={client_token}"},
        )
        assert res.status_code == 200, f"Create order failed: {res.text}"
        order_id = res.json()["order_id"]
        assert res.json()["state"] == "Złożone"

        res = await client.post(
            "/token", data={"username": operator_email, "password": password}
        )
        assert res.status_code == 200
        operator_token = res.cookies["access_token"]

        res = await client.get(
            "/operators/services", headers={"Cookie": f"access_token={operator_token}"}
        )
        assert res.status_code == 200
        all_services = res.json()
        target_service = next(
            (s for s in all_services if s["name"] == "Ortofotomapa"), None
        )
        assert target_service is not None, "Service 'Ortofotomapa' not found in DB seed"

        res = await client.put(
            "/operators/me/services",
            json={"services": [target_service["service_id"]]},
            headers={"Cookie": f"access_token={operator_token}"},
        )
        assert res.status_code == 200

        res = await client.get(
            "/orders/matched", headers={"Cookie": f"access_token={operator_token}"}
        )
        assert res.status_code == 200
        print(f"Matched orders: {res.json()}")
        matched_order = next((o for o in res.json() if o["order_id"] == order_id), None)
        assert matched_order is not None
        assert matched_order["has_applied"] is False

        res = await client.post(
            f"/orders/{order_id}/interest",
            headers={"Cookie": f"access_token={operator_token}"},
        )
        assert res.status_code == 200

        res = await client.get(
            "/orders/matched", headers={"Cookie": f"access_token={operator_token}"}
        )
        assert res.status_code == 200
        matched_order = next((o for o in res.json() if o["order_id"] == order_id), None)
        assert matched_order is not None
        assert matched_order["has_applied"] is True

        res = await client.post(
            f"/orders/{order_id}/select/{operator_id}",
            headers={"Cookie": f"access_token={client_token}"},
        )
        assert res.status_code == 200

        res = await client.get(
            f"/orders/{order_id}", headers={"Cookie": f"access_token={client_token}"}
        )
        assert res.status_code == 200
        assert res.json()["state"] == "W trakcie"

        res = await client.post(
            f"/orders/{order_id}/complete",
            headers={"Cookie": f"access_token={client_token}"},
        )
        assert res.status_code == 200

        res = await client.get(
            f"/orders/{order_id}", headers={"Cookie": f"access_token={client_token}"}
        )
        assert res.status_code == 200
        assert res.json()["state"] == "Zakończone"


if __name__ == "__main__":
    asyncio.run(test_order_completion_flow())
    print("Test passed successfully!")
