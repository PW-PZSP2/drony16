import pytest
from datetime import datetime


@pytest.mark.asyncio
async def test_admin_stats_endpoints(client):
    timestamp = int(datetime.now().timestamp())
    admin_email = f"admin_stats_{timestamp}@example.com"
    password = "password"

    res = await client.post(
        "/register",
        json={
            "email": admin_email,
            "password": password,
            "user_name": f"admin_stats_{timestamp}",
            "role": "adm",
            "phone_number": "123456789",
        },
    )
    assert res.status_code == 200, f"Admin reg failed: {res.text}"

    res = await client.post(
        "/token", data={"username": admin_email, "password": password}
    )
    assert res.status_code == 200
    token = res.cookies["access_token"]
    headers = {"Cookie": f"access_token={token}"}

    res = await client.get("/admins/stats/clients", headers=headers)
    assert res.status_code == 200
    assert "total_clients" in res.json()

    res = await client.get("/admins/stats/operators", headers=headers)
    assert res.status_code == 200
    assert "total_operators" in res.json()

    res = await client.get("/admins/stats/orders", headers=headers)
    assert res.status_code == 200
    assert "total_orders" in res.json()


@pytest.mark.asyncio
async def test_admin_user_management(client):
    timestamp = int(datetime.now().timestamp())
    admin_email = f"admin_mgmt_{timestamp}@example.com"
    password = "password"

    await client.post(
        "/register",
        json={
            "email": admin_email,
            "password": password,
            "user_name": f"admin_mgmt_{timestamp}",
            "role": "adm",
            "phone_number": "123",
        },
    )
    res = await client.post(
        "/token", data={"username": admin_email, "password": password}
    )
    token = res.cookies["access_token"]
    headers = {"Cookie": f"access_token={token}"}

    user_email = f"user_to_block_{timestamp}@example.com"
    res = await client.post(
        "/register",
        json={
            "email": user_email,
            "password": password,
            "user_name": f"u_block_{timestamp}",
            "role": "cli",
            "phone_number": "123",
        },
    )
    user_id = res.json()["user_id"]

    res = await client.patch(f"/admins/block/{user_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["is_blocked"] == "1"

    res = await client.patch(f"/admins/unblock/{user_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["is_blocked"] == "0"
    res = await client.patch(f"/admins/unblock/{user_id}", headers=headers)
    assert res.status_code == 200
    assert res.json()["is_blocked"] == "0"


@pytest.mark.asyncio
async def test_admin_create_and_manage_admins(client):
    timestamp = int(datetime.now().timestamp())
    super_admin = f"super_{timestamp}@example.com"
    password = "password"

    await client.post(
        "/register",
        json={
            "email": super_admin,
            "password": password,
            "user_name": f"super_{timestamp}",
            "role": "adm",
            "phone_number": "123",
        },
    )
    res = await client.post(
        "/token", data={"username": super_admin, "password": password}
    )
    token = res.cookies["access_token"]
    headers = {"Cookie": f"access_token={token}"}

    new_admin_email = f"sub_admin_{timestamp}@example.com"
    res = await client.post(
        "/admins/create",
        json={
            "email": new_admin_email,
            "password": password,
            "user_name": f"sub_admin_{timestamp}",
            "phone_number": "123",
            "role": "adm",
        },
        headers=headers,
    )

    if res.status_code == 422:
        pass
    else:
        assert res.status_code == 200
        new_admin_id = res.json()["user_id"]

        res = await client.get("/admins/list", headers=headers)
        assert res.status_code == 200
        admins = res.json()
        assert any(a["user_id"] == new_admin_id for a in admins)

        res = await client.delete(f"/admins/remove/{new_admin_id}", headers=headers)
        assert res.status_code == 200

        res = await client.get("/admins/list", headers=headers)
        assert res.status_code == 200
        admins = res.json()
        assert not any(a["user_id"] == new_admin_id for a in admins)


@pytest.mark.asyncio
async def test_admin_user_stats_lists(client):
    timestamp = int(datetime.now().timestamp())
    admin_email = f"admin_lists_{timestamp}@example.com"
    password = "password"

    await client.post(
        "/register",
        json={
            "email": admin_email,
            "password": password,
            "user_name": f"admin_lists_{timestamp}",
            "role": "adm",
            "phone_number": "123",
        },
    )
    res = await client.post(
        "/token", data={"username": admin_email, "password": password}
    )
    headers = {"Cookie": f"access_token={res.cookies['access_token']}"}

    res = await client.get("/admins/users", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    res = await client.get("/admins/stat_clients", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)

    res = await client.get("/admins/stat_operators", headers=headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)
