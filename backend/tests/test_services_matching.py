import pytest
from datetime import datetime


@pytest.mark.asyncio
async def test_matching_logic_via_api(client):
    timestamp = int(datetime.now().timestamp())
    password = "password"

    ope_email = f"match_ope_{timestamp}@example.com"
    res = await client.post(
        "/register",
        json={
            "email": ope_email,
            "password": password,
            "user_name": f"match_ope_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Warsaw",
            "area": 10,
        },
    )
    ope_token = (
        await client.post("/token", data={"username": ope_email, "password": password})
    ).cookies["access_token"]
    ope_headers = {"Cookie": f"access_token={ope_token}"}

    services = (await client.get("/operators/services", headers=ope_headers)).json()
    svc1 = services[0]["service_id"]

    await client.put(
        "/operators/me/services", json={"services": [svc1]}, headers=ope_headers
    )

    cli_email = f"match_cli_{timestamp}@example.com"
    await client.post(
        "/register",
        json={
            "email": cli_email,
            "password": password,
            "user_name": f"match_cli_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )
    cli_token = (
        await client.post("/token", data={"username": cli_email, "password": password})
    ).cookies["access_token"]
    cli_headers = {"Cookie": f"access_token={cli_token}"}

    order_a = {
        "name": "Order A",
        "description": "Match",
        "location": "Warsaw",
        "raid_date": True,
        "completion_date": False,
        "deadline": (datetime.now()).isoformat(),
        "services": [{"service_name": services[0]["name"], "parameters": {}}],
    }

    order_b = {
        "name": "Order B",
        "description": "Bad Service",
        "location": "Warsaw",
        "raid_date": True,
        "completion_date": False,
        "deadline": (datetime.now()).isoformat(),
        "services": [{"service_name": services[1]["name"], "parameters": {}}],
    }

    order_c = {
        "name": "Order C",
        "description": "Far",
        "location": "Krakow",
        "raid_date": True,
        "completion_date": False,
        "deadline": (datetime.now()).isoformat(),
        "services": [{"service_name": services[0]["name"], "parameters": {}}],
    }

    res_a = await client.post("/orders", json=order_a, headers=cli_headers)
    id_a = res_a.json()["order_id"]

    res_b = await client.post("/orders", json=order_b, headers=cli_headers)
    id_b = res_b.json()["order_id"]

    res_c = await client.post("/orders", json=order_c, headers=cli_headers)
    id_c = res_c.json()["order_id"]

    res = await client.get("/orders/matched", headers=ope_headers)
    assert res.status_code == 200
    matched = res.json()
    matched_ids = [o["order_id"] for o in matched]

    assert id_a in matched_ids, "Should match: correct service and location"
    assert id_b not in matched_ids, "Should not match: operator lacks service"
    assert id_c not in matched_ids, "Should not match: too far away"
