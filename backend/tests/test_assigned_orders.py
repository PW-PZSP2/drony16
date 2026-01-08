import httpx
import asyncio
import pytest
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8080"


@pytest.mark.asyncio
async def test_assigned_orders():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=30.0) as client:
        timestamp = int(datetime.now().timestamp())

        client_email = f"client_assign_{timestamp}@example.com"
        client_pass = "clientpass"
        op_email = f"operator_assign_{timestamp}@example.com"
        op_pass = "operatorpass"

        print(f"Registering client: {client_email}", flush=True)
        await client.post(
            "/register",
            json={
                "email": client_email,
                "user_name": f"client_assign_{timestamp}",
                "password": client_pass,
                "role": "cli",
                "phone_number": "111222333",
                "localisation": "Krakow",
                "area": 50,
            },
        )

        print(f"Registering operator: {op_email}", flush=True)
        op_reg = await client.post(
            "/register",
            json={
                "email": op_email,
                "user_name": f"operator_assign_{timestamp}",
                "password": op_pass,
                "role": "ope",
                "phone_number": "444555666",
                "localisation": "Krakow",
                "area": 200,
            },
        )
        op_id = op_reg.json()["user_id"]

        await client.post(
            "/token", data={"username": client_email, "password": client_pass}
        )

        deadline = (datetime.now() + timedelta(days=30)).isoformat()
        order_payload = {
            "name": f"Order Assigned Test {timestamp}",
            "description": "Testing assigned orders retrieval",
            "location": "Krakow",
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
        order_res = await client.post("/orders", json=order_payload)
        assert order_res.status_code == 200
        order_id = order_res.json()["order_id"]
        print(f"Order created with ID: {order_id}", flush=True)

        await client.post("/logout")

        await client.post("/token", data={"username": op_email, "password": op_pass})

        print("Registering interest...", flush=True)
        await client.post(f"/orders/{order_id}/interest")

        print("Checking assigned orders (expecting empty)...", flush=True)
        assigned_res = await client.get("/orders/assigned")
        assert assigned_res.status_code == 200
        assigned_orders = assigned_res.json()
        assert len([o for o in assigned_orders if o["order_id"] == order_id]) == 0

        await client.post("/logout")
        await client.post(
            "/token", data={"username": client_email, "password": client_pass}
        )

        print(f"Selecting operator {op_id}...", flush=True)
        select_res = await client.post(f"/orders/{order_id}/select/{op_id}")
        assert select_res.status_code == 200

        await client.post("/logout")

        await client.post("/token", data={"username": op_email, "password": op_pass})

        print("Checking assigned orders (expecting 1)...", flush=True)
        assigned_res_final = await client.get("/orders/assigned")
        assert assigned_res_final.status_code == 200
        assigned_orders_final = assigned_res_final.json()

        matched = [o for o in assigned_orders_final if o["order_id"] == order_id]
        print(f"Found {len(matched)} matched orders in assigned list.", flush=True)
        assert len(matched) == 1
        assert matched[0]["operator_id"] == op_id

        print("Assigned orders verification passed!", flush=True)


if __name__ == "__main__":
    print("STARTING ASSIGNED ORDERS TEST", flush=True)
    try:
        asyncio.run(test_assigned_orders())
        print("FINISHED ASSIGNED ORDERS TEST", flush=True)
    except Exception as e:
        import traceback

        traceback.print_exc()
        print(f"TEST FAILED: {repr(e)}", flush=True)
