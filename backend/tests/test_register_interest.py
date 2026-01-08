import httpx
import asyncio
import pytest
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8080"


@pytest.mark.asyncio
async def test_register_interest():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        timestamp = int(datetime.now().timestamp())

        client_email = f"client_{timestamp}@example.com"
        client_pass = "clientpass"
        reg_res = await client.post(
            "/register",
            json={
                "email": client_email,
                "user_name": f"client_{timestamp}",
                "password": client_pass,
                "role": "cli",
                "phone_number": "111222333",
                "localisation": "Warsaw",
                "area": 100,
            },
        )
        if reg_res.status_code != 200:
            print(f"Client registration failed: {reg_res.text}", flush=True)
            return

        login_res = await client.post(
            "/token", data={"username": client_email, "password": client_pass}
        )
        assert login_res.status_code == 200

        deadline = (datetime.now() + timedelta(days=30)).isoformat()
        order_payload = {
            "name": f"Order Interest Test {timestamp}",
            "description": "Testing interest registration",
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
        order_res = await client.post(
            "/orders",
            json=order_payload,
        )
        if order_res.status_code != 200:
            print(f"Order creation failed: {order_res.text}", flush=True)

        assert order_res.status_code == 200
        order_id = order_res.json()["order_id"]

        op_email = f"operator_{timestamp}@example.com"
        op_pass = "operatorpass"
        await client.post(
            "/register",
            json={
                "email": op_email,
                "user_name": f"operator_{timestamp}",
                "password": op_pass,
                "role": "ope",
                "phone_number": "444555666",
                "localisation": "Warsaw",
                "area": 200,
            },
        )

        op_login_res = await client.post(
            "/token", data={"username": op_email, "password": op_pass}
        )
        assert op_login_res.status_code == 200

        interest_res = await client.post(
            f"/orders/{order_id}/interest",
        )

        if interest_res.status_code != 200:
            print(f"Interest registration failed: {interest_res.text}", flush=True)

        assert interest_res.status_code == 200

        interest_res_2 = await client.post(
            f"/orders/{order_id}/interest",
        )
        assert interest_res_2.status_code == 400


if __name__ == "__main__":
    try:
        asyncio.run(test_register_interest())
        print("SUKCES")
    except Exception as e:
        print(f"TEST FAILED: {e}")
