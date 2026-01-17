import pytest


@pytest.mark.asyncio
async def test_operator_services_updates(client):
    import time

    timestamp = str(time.time()).replace(".", "")
    password = "password"

    email = f"ope_svcs_{timestamp}@example.com"
    res = await client.post(
        "/register",
        json={
            "email": email,
            "password": password,
            "user_name": f"ope_svcs_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Warsaw",
            "area": 20,
        },
    )
    assert res.status_code == 200, f"Register failed: {res.text}"

    login_res = await client.post(
        "/token", data={"username": email, "password": password}
    )
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.cookies["access_token"]
    headers = {"Cookie": f"access_token={token}"}

    res = await client.get("/operators/services", headers=headers)
    assert res.status_code == 200
    all_services = res.json()
    assert len(all_services) >= 1

    svc1 = all_services[0]

    res = await client.put(
        "/operators/me/services",
        json={"services": [svc1["service_id"]]},
        headers=headers,
    )
    assert res.status_code == 200
    assert res.json()["service_ids"] == [svc1["service_id"]]

    res = await client.put(
        "/operators/me/services", json={"services": [svc1["name"]]}, headers=headers
    )
    assert res.status_code == 200
    assert res.json()["service_ids"] == [svc1["service_id"]]

    res = await client.put(
        "/operators/me/services",
        json={"services": [{"id": svc1["service_id"]}]},
        headers=headers,
    )
    assert res.status_code == 200

    res = await client.put(
        "/operators/me/services",
        json={"services": [{"name": svc1["name"]}]},
        headers=headers,
    )
    assert res.status_code == 200

    res = await client.put(
        "/operators/me/services", json={"services": "invalid"}, headers=headers
    )
    assert res.status_code == 422

    res = await client.put(
        "/operators/me/services",
        json={"services": ["NonExistentServiceXY"]},
        headers=headers,
    )
    assert res.status_code == 400
    assert "Services not found" in res.json()["detail"]

    res = await client.put(
        "/operators/me/services", json={"services": [{"id": "abc"}]}, headers=headers
    )
    assert res.status_code == 400

    res = await client.put(
        "/operators/me/services", json={"services": []}, headers=headers
    )
    assert res.status_code == 200
    assert res.json()["service_ids"] == []


@pytest.mark.asyncio
async def test_operator_profile_updates(client):
    import time

    timestamp = str(time.time()).replace(".", "")
    password = "password"
    email = f"ope_prof_{timestamp}@example.com"

    res = await client.post(
        "/register",
        json={
            "email": email,
            "password": password,
            "user_name": f"ope_prof_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Old",
            "area": 10,
        },
    )
    assert res.status_code == 200

    login_res = await client.post(
        "/token", data={"username": email, "password": password}
    )
    assert login_res.status_code == 200
    token = login_res.cookies["access_token"]
    headers = {"Cookie": f"access_token={token}"}

    res = await client.patch(
        "/operators/me/location", json={"localisation": "Warsaw"}, headers=headers
    )
    assert res.status_code == 200
    assert res.json()["localisation"] == "Warsaw"
    assert res.json()["latitude"] is not None

    res = await client.patch("/operators/me/area", json={"area": 50}, headers=headers)
    assert res.status_code == 200
    assert res.json()["area"] == 50


@pytest.mark.asyncio
async def test_operator_attachments(client):
    import time

    timestamp = str(time.time()).replace(".", "")
    password = "password"
    email = f"ope_att_{timestamp}@example.com"

    res = await client.post(
        "/register",
        json={
            "email": email,
            "password": password,
            "user_name": f"ope_att_{timestamp}",
            "role": "ope",
            "phone_number": "123",
            "localisation": "Warsaw",
            "area": 20,
        },
    )
    assert res.status_code == 200

    login_res = await client.post(
        "/token", data={"username": email, "password": password}
    )
    assert login_res.status_code == 200
    token = login_res.cookies["access_token"]
    headers = {"Cookie": f"access_token={token}"}

    data = {
        "file_url": "http://example.com/cert.pdf",
        "name": "Certificate",
        "description": "My drone license",
    }
    res = await client.post("/operators/me/add_attachments", data=data, headers=headers)
    assert res.status_code == 200
    att_id = res.json()["attachment_id"]

    res = await client.get("/operators/me/attachments", headers=headers)
    assert res.status_code == 200
    atts = res.json()["attachments"]
    assert any(a["attachment_id"] == att_id for a in atts)

    res = await client.delete(
        f"/operators/me/remove_attachments/{att_id}", headers=headers
    )
    assert res.status_code == 200

    res = await client.get("/operators/me/attachments", headers=headers)
    assert res.status_code == 200
    atts = res.json()["attachments"]
    assert not any(a["attachment_id"] == att_id for a in atts)

    res = await client.delete(
        f"/operators/me/remove_attachments/{att_id}", headers=headers
    )
    assert res.status_code == 404
