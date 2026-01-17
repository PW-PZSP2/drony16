import pytest
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_order_opinions(client):
    import time

    timestamp = str(time.time()).replace(".", "")
    password = "password"

    cli_email = f"op_cli_{timestamp}@example.com"
    res = await client.post(
        "/register",
        json={
            "email": cli_email,
            "password": password,
            "user_name": f"op_cli_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )
    assert res.status_code == 200

    cli_token = (
        await client.post("/token", data={"username": cli_email, "password": password})
    ).cookies["access_token"]
    cli_headers = {"Cookie": f"access_token={cli_token}"}

    ope_email = f"op_ope_{timestamp}@example.com"
    res = await client.post(
        "/register",
        json={
            "email": ope_email,
            "password": password,
            "user_name": f"op_ope_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Warsaw",
            "area": 20,
        },
    )
    assert res.status_code == 200

    ope_token = (
        await client.post("/token", data={"username": ope_email, "password": password})
    ).cookies["access_token"]
    ope_headers = {"Cookie": f"access_token={ope_token}"}

    svc_res = await client.get("/operators/services", headers=cli_headers)
    service_name = svc_res.json()[0]["name"]
    svc_id = svc_res.json()[0]["service_id"]
    await client.put(
        "/operators/me/services", json={"services": [svc_id]}, headers=ope_headers
    )

    deadline = (datetime.now() + timedelta(days=5)).isoformat()
    order_data = {
        "name": "Opinion Order",
        "description": "Desc",
        "location": "Loc",
        "raid_date": True,
        "completion_date": False,
        "deadline": deadline,
        "services": [{"service_name": service_name, "parameters": {}}],
    }
    res = await client.post("/orders", json=order_data, headers=cli_headers)
    order_id = res.json()["order_id"]

    ope_id = (await client.get("/operators/me/services", headers=ope_headers)).json()[
        "user_id"
    ]
    await client.post(f"/orders/{order_id}/interest", headers=ope_headers)
    await client.post(f"/orders/{order_id}/select/{ope_id}", headers=cli_headers)
    await client.post(f"/orders/{order_id}/complete", headers=cli_headers)

    opinion_data = {"score": 5, "opinion": "Great job!"}
    res = await client.post(
        f"/orders/{order_id}/opinion", json=opinion_data, headers=cli_headers
    )
    assert res.status_code == 200
    assert res.json()["score"] == 5

    res = await client.post(
        f"/orders/{order_id}/opinion", json=opinion_data, headers=cli_headers
    )
    assert res.status_code == 400
    assert "already set" in res.json()["detail"]

    res = await client.post("/orders", json=order_data, headers=cli_headers)
    oid2 = res.json()["order_id"]

    res = await client.post(
        f"/orders/{oid2}/opinion",
        json={"score": 6, "opinion": "Too high"},
        headers=cli_headers,
    )
    assert res.status_code == 400

    res = await client.post(
        f"/orders/{oid2}/opinion",
        json={"score": 0, "opinion": "Too low"},
        headers=cli_headers,
    )
    assert res.status_code == 400

    res = await client.post(
        f"/orders/{oid2}/opinion",
        json={"score": 4, "opinion": "Self vote"},
        headers=ope_headers,
    )
    assert res.status_code == 403


@pytest.mark.asyncio
async def test_order_creation_invalid_params(client):
    timestamp = int(datetime.now().timestamp())
    password = "password"
    cli_email = f"inv_ord_{timestamp}@example.com"
    await client.post(
        "/register",
        json={
            "email": cli_email,
            "password": password,
            "user_name": f"inv_ord_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )
    cli_token = (
        await client.post("/token", data={"username": cli_email, "password": password})
    ).cookies["access_token"]
    cli_headers = {"Cookie": f"access_token={cli_token}"}

    svc_res = await client.get("/operators/services", headers=cli_headers)
    service_name = svc_res.json()[0]["name"]

    deadline = (datetime.now() + timedelta(days=5)).isoformat()

    order_data = {
        "name": "Invalid Order",
        "description": "Desc",
        "location": "Loc",
        "raid_date": True,
        "completion_date": False,
        "deadline": deadline,
        "services": [
            {"service_name": service_name, "parameters": {"NonExistentParam": "123"}}
        ],
    }

    res = await client.post("/orders", json=order_data, headers=cli_headers)
    assert res.status_code == 400
    assert "Parameter 'NonExistentParam' not found" in res.json()["detail"]

    order_data["services"] = [{"service_name": "GhostService", "parameters": {}}]
    res = await client.post("/orders", json=order_data, headers=cli_headers)
    assert res.status_code == 400
    assert "Service 'GhostService' not found" in res.json()["detail"]


@pytest.mark.asyncio
async def test_order_candidates_security(client):
    import time

    timestamp = str(time.time()).replace(".", "")
    password = "password"

    cli1_email = f"cli1_sec_{timestamp}@example.com"
    await client.post(
        "/register",
        json={
            "email": cli1_email,
            "password": password,
            "user_name": f"cli1_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )
    cli1_token = (
        await client.post("/token", data={"username": cli1_email, "password": password})
    ).cookies["access_token"]
    cli1_headers = {"Cookie": f"access_token={cli1_token}"}

    cli2_email = f"cli2_sec_{timestamp}@example.com"
    await client.post(
        "/register",
        json={
            "email": cli2_email,
            "password": password,
            "user_name": f"cli2_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )
    cli2_token = (
        await client.post("/token", data={"username": cli2_email, "password": password})
    ).cookies["access_token"]
    cli2_headers = {"Cookie": f"access_token={cli2_token}"}

    res = await client.get("/operators/services", headers=cli1_headers)
    svc = res.json()[0]["name"]
    order_data = {
        "name": "Sec Order",
        "description": "D",
        "location": "L",
        "raid_date": True,
        "completion_date": False,
        "deadline": (datetime.now() + timedelta(days=5)).isoformat(),
        "services": [{"service_name": svc, "parameters": {}}],
    }
    res = await client.post("/orders", json=order_data, headers=cli1_headers)
    assert res.status_code == 200
    order_id = res.json()["order_id"]

    res = await client.get(f"/orders/{order_id}/candidates", headers=cli2_headers)
    assert res.status_code == 404

    res = await client.get("/orders/999999/candidates", headers=cli1_headers)
    assert res.status_code == 404
