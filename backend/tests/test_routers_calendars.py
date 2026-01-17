import pytest
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_calendars_permissions(client):
    timestamp = int(datetime.now().timestamp())
    password = "password"

    cli_email = f"cal_cli_{timestamp}@example.com"
    res = await client.post(
        "/register",
        json={
            "email": cli_email,
            "password": password,
            "user_name": f"cal_cli_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )

    ope_email = f"cal_ope_{timestamp}@example.com"
    res = await client.post(
        "/register",
        json={
            "email": ope_email,
            "password": password,
            "user_name": f"cal_ope_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Loc",
            "area": 100,
        },
    )
    ope_id = res.json()["user_id"]

    adm_email = f"cal_adm_{timestamp}@example.com"
    await client.post(
        "/register",
        json={
            "email": adm_email,
            "password": password,
            "user_name": f"cal_adm_{timestamp}",
            "role": "adm",
            "phone_number": "123",
        },
    )

    cli_token = (
        await client.post("/token", data={"username": cli_email, "password": password})
    ).cookies["access_token"]
    ope_token = (
        await client.post("/token", data={"username": ope_email, "password": password})
    ).cookies["access_token"]
    adm_token = (
        await client.post("/token", data={"username": adm_email, "password": password})
    ).cookies["access_token"]

    cli_headers = {"Cookie": f"access_token={cli_token}"}
    ope_headers = {"Cookie": f"access_token={ope_token}"}
    adm_headers = {"Cookie": f"access_token={adm_token}"}

    deadline = (datetime.now() + timedelta(days=5)).isoformat()
    order_payload = {
        "name": "Calendar Order",
        "description": "Desc",
        "location": "Loc",
        "raid_date": True,
        "completion_date": False,
        "deadline": deadline,
        "services": [{"service_name": "Film", "parameters": {}}],
    }
    res = await client.post("/orders", json=order_payload, headers=cli_headers)
    order_id = res.json()["order_id"]

    res = await client.get("/calendars/orders", headers=cli_headers)
    assert res.status_code == 200
    assert any(o["order_id"] == order_id for o in res.json())

    res = await client.get("/calendars/orders", headers=ope_headers)
    assert res.status_code == 200
    assert not any(o["order_id"] == order_id for o in res.json())

    services_res = await client.get("/operators/services", headers=ope_headers)
    svc_id = services_res.json()[0]["service_id"]
    await client.put(
        "/operators/me/services", json={"services": [svc_id]}, headers=ope_headers
    )

    await client.post(f"/orders/{order_id}/interest", headers=ope_headers)
    res = await client.post(f"/orders/{order_id}/select/{ope_id}", headers=cli_headers)
    assert res.status_code == 200

    res = await client.get("/calendars/orders", headers=ope_headers)
    assert res.status_code == 200
    assert any(o["order_id"] == order_id for o in res.json())

    res = await client.get("/calendars/orders", headers=adm_headers)
    assert res.status_code == 403
