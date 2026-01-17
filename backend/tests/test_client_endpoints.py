import pytest
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_client_endpoints_flow(client):
    timestamp = int(datetime.now().timestamp())
    client_email = f"cli_endp_{timestamp}@example.com"
    op1_email = f"op1_endp_{timestamp}@example.com"
    op2_email = f"op2_endp_{timestamp}@example.com"
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
            "email": op1_email,
            "password": password,
            "user_name": f"op1_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Loc1",
            "area": 100,
        },
    )
    await client.post(
        "/register",
        json={
            "email": op2_email,
            "password": password,
            "user_name": f"op2_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Loc2",
            "area": 100,
        },
    )

    res = await client.post(
        "/token", data={"username": client_email, "password": password}
    )
    client_token = res.cookies["access_token"]
    client_headers = {"Cookie": f"access_token={client_token}"}

    res = await client.post(
        "/token", data={"username": op1_email, "password": password}
    )
    op1_token = res.cookies["access_token"]
    op1_headers = {"Cookie": f"access_token={op1_token}"}
    op1_id = (await client.get("/users/me", headers=op1_headers)).json()["user_id"]

    res = await client.post(
        "/token", data={"username": op2_email, "password": password}
    )
    op2_token = res.cookies["access_token"]
    op2_headers = {"Cookie": f"access_token={op2_token}"}
    op2_id = (await client.get("/users/me", headers=op2_headers)).json()["user_id"]

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
        json={**order_payload, "name": "PendingNoApps"},
        headers=client_headers,
    )
    order1_id = res.json()["order_id"]

    res = await client.post(
        "/orders",
        json={**order_payload, "name": "PendingWithApps"},
        headers=client_headers,
    )
    order2_id = res.json()["order_id"]

    res = await client.post(
        "/orders",
        json={**order_payload, "name": "AssignedOrder"},
        headers=client_headers,
    )
    order3_id = res.json()["order_id"]

    await client.post(f"/orders/{order2_id}/interest", headers=op1_headers)
    await client.post(f"/orders/{order2_id}/interest", headers=op2_headers)

    await client.post(f"/orders/{order3_id}/interest", headers=op1_headers)
    await client.post(f"/orders/{order3_id}/select/{op1_id}", headers=client_headers)

    res = await client.get("/orders/client/pending", headers=client_headers)
    assert res.status_code == 200
    pending_orders = res.json()
    assert len(pending_orders) == 2
    pending_ids = [o["order_id"] for o in pending_orders]
    assert order1_id in pending_ids
    assert order2_id in pending_ids
    assert order3_id not in pending_ids

    for o in pending_orders:
        if o["order_id"] == order1_id:
            assert len(o.get("interested_operators", [])) == 0
        if o["order_id"] == order2_id:
            assert len(o.get("interested_operators", [])) == 2

    res = await client.get(f"/orders/{order2_id}/candidates", headers=client_headers)
    assert res.status_code == 200
    candidates = res.json()
    assert len(candidates) == 2
    cand_ids = [c["user_id"] for c in candidates]
    assert op1_id in cand_ids
    assert op2_id in cand_ids

    res = await client.get("/orders/client/history", headers=client_headers)
    assert res.status_code == 200
    history_orders = res.json()
    assert len(history_orders) >= 1
    hist_ids = [o["order_id"] for o in history_orders]
    assert order3_id in hist_ids
    assert order1_id not in hist_ids
    assert order2_id not in hist_ids

    o3_data = next(o for o in history_orders if o["order_id"] == order3_id)
    assert o3_data["operator_id"] == op1_id
