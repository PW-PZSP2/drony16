import httpx
import asyncio
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8080"


async def test_select_operator():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        timestamp = int(datetime.now().timestamp())

        client_email = f"client_sel_{timestamp}@example.com"
        client_pass = "clientpass"
        await client.post(
            "/register",
            json={
                "email": client_email,
                "user_name": f"client_sel_{timestamp}",
                "password": client_pass,
                "role": "cli",
                "phone_number": "111222333",
                "localisation": "Krakow",
                "area": 50,
            },
        )
        login_res = await client.post(
            "/token", data={"username": client_email, "password": client_pass}
        )
        assert login_res.status_code == 200

        deadline = (datetime.now() + timedelta(days=30)).isoformat()
        order_payload = {
            "name": f"Order Select Test {timestamp}",
            "description": "Testing operator selection",
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

        await client.post("/logout")
        client.cookies.clear()

        op_email = f"operator_sel_{timestamp}@example.com"
        op_pass = "operatorpass"
        op_reg = await client.post(
            "/register",
            json={
                "email": op_email,
                "user_name": f"operator_sel_{timestamp}",
                "password": op_pass,
                "role": "ope",
                "phone_number": "444555666",
                "localisation": "Krakow",
                "area": 200,
            },
        )
        op_id = op_reg.json()["user_id"]
        op_login_res = await client.post(
            "/token", data={"username": op_email, "password": op_pass}
        )
        assert op_login_res.status_code == 200

        interest_res = await client.post(f"/orders/{order_id}/interest")
        assert interest_res.status_code == 200

        await client.post("/logout")
        client.cookies.clear()

        await client.post(
            "/token", data={"username": client_email, "password": client_pass}
        )

        get_order_res = await client.get(f"/orders/{order_id}")
        if get_order_res.status_code != 200:
            print(f"Get order failed: {get_order_res.text}", flush=True)
        assert get_order_res.status_code == 200
        interested_ops = get_order_res.json().get("interested_operators", [])
        assert op_id in interested_ops

        select_res = await client.post(f"/orders/{order_id}/select/{op_id}")
        if select_res.status_code != 200:
            print(f"Selection failed: {select_res.text}", flush=True)
        assert select_res.status_code == 200

        get_order_res_2 = await client.get(f"/orders/{order_id}")
        order_data = get_order_res_2.json()
        assert order_data.get("operator_id") == op_id


if __name__ == "__main__":
    try:
        asyncio.run(test_select_operator())
        print("SUKCES")
    except Exception as e:
        import traceback

        traceback.print_exc()
        print(f"TEST FAILED: {repr(e)}")
