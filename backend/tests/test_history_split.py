import pytest
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_order_history_split(client):
    timestamp = int(datetime.now().timestamp())
    client_email = f"cli_hist_{timestamp}@example.com"
    operator_email = f"ope_hist_{timestamp}@example.com"
    password = "password"

    await client.post(
        "/register",
        json={
            "email": client_email,
            "password": password,
            "user_name": f"cli_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )
    await client.post(
        "/register",
        json={
            "email": operator_email,
            "password": password,
            "user_name": f"ope_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Warsaw",
            "area": 100,
        },
    )

    res = await client.post(
        "/token", data={"username": client_email, "password": password}
    )
    client_token = res.cookies["access_token"]

    order_payload = {
        "name": "Order",
        "description": "D",
        "location": "Warsaw",
        "raid_date": True,
        "completion_date": False,
        "deadline": (datetime.now() + timedelta(days=30)).isoformat(),
        "services": [{"service_name": "Film", "parameters": {}}],
    }

    res = await client.post(
        "/orders",
        json={**order_payload, "name": "ActiveOrder"},
        headers={"Cookie": f"access_token={client_token}"},
    )
    order1_id = res.json()["order_id"]

    res = await client.post(
        "/orders",
        json={**order_payload, "name": "DoneOrder"},
        headers={"Cookie": f"access_token={client_token}"},
    )
    order2_id = res.json()["order_id"]

    res = await client.post(
        "/token", data={"username": operator_email, "password": password}
    )
    operator_token = res.cookies["access_token"]
    req = await client.get(
        "/operators/me/services",
        headers={"Cookie": f"access_token={operator_token}"},
    )
    print(f"Operator Me Response: {req.text}")
    operator_id = req.json()["user_id"]

    await client.put(
        "/operators/me/services",
        json={"services": ["Film"]},
        headers={"Cookie": f"access_token={operator_token}"},
    )

    await client.post(
        f"/orders/{order1_id}/interest",
        headers={"Cookie": f"access_token={operator_token}"},
    )
    await client.post(
        f"/orders/{order2_id}/interest",
        headers={"Cookie": f"access_token={operator_token}"},
    )

    await client.post(
        f"/orders/{order1_id}/select/{operator_id}",
        headers={"Cookie": f"access_token={client_token}"},
    )
    await client.post(
        f"/orders/{order2_id}/select/{operator_id}",
        headers={"Cookie": f"access_token={client_token}"},
    )

    await client.post(
        f"/orders/{order2_id}/complete",
        headers={"Cookie": f"access_token={client_token}"},
    )

    res = await client.get(
        "/orders/assigned", headers={"Cookie": f"access_token={operator_token}"}
    )
    assigned = res.json()
    print(f"Assigned IDs: {[o['order_id'] for o in assigned]}")
    assert any(o["order_id"] == order1_id for o in assigned), (
        "Active Order 1 missing from assigned"
    )
    assert not any(o["order_id"] == order2_id for o in assigned), (
        "Completed Order 2 present in assigned"
    )

    res = await client.get(
        "/orders/history", headers={"Cookie": f"access_token={operator_token}"}
    )
    history = res.json()
    print(f"History IDs: {[o['order_id'] for o in history]}")
    assert not any(o["order_id"] == order1_id for o in history), (
        "Active Order 1 present in history"
    )
    assert any(o["order_id"] == order2_id for o in history), (
        "Completed Order 2 missing from history"
    )
