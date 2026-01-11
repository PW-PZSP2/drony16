import pytest
import asyncio
import httpx

BASE_URL = "http://localhost:8080"


@pytest.mark.asyncio
async def test_change_password():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=10.0) as client:
        user_name = "test_pw_change"
        email = "change_pw@example.com"
        password = "password123"

        print("Registering user...")
        response = await client.post(
            "/register",
            json={
                "email": email,
                "password": password,
                "user_name": user_name,
                "phone_number": "123456789",
                "role": "cli",
            },
        )
        if response.status_code == 400 and "Email already registered" in response.text:
            print("User exists.")
        else:
            assert response.status_code == 200, f"Registration failed: {response.text}"

        print("Logging in...")
        response = await client.post(
            "/token", data={"username": email, "password": password}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"

        print("Testing password mismatch...")
        response = await client.put(
            "/users/me/password",
            json={
                "current_password": password,
                "new_password": "newpassword456",
                "confirm_new_password": "mismatchpassword",
            },
        )
        assert response.status_code == 422, (
            f"Expected 422 for mismatch, got {response.status_code}: {response.text}"
        )

        print("Testing wrong current password...")
        response = await client.put(
            "/users/me/password",
            json={
                "current_password": "wrongpassword",
                "new_password": "newpassword456",
                "confirm_new_password": "newpassword456",
            },
        )
        assert response.status_code == 400, (
            f"Expected 400 for wrong password, got {response.status_code}: {response.text}"
        )

        new_password = "newpassword456"
        print("Testing successful password change...")
        response = await client.put(
            "/users/me/password",
            json={
                "current_password": password,
                "new_password": new_password,
                "confirm_new_password": new_password,
            },
        )
        assert response.status_code == 200, f"Password change failed: {response.text}"

        print("Verifying login with new password...")
        response = await client.post(
            "/token", data={"username": email, "password": new_password}
        )
        assert response.status_code == 200, (
            f"Login with new password failed: {response.text}"
        )
        print("Reverting password...")
        await client.put(
            "/users/me/password",
            json={
                "current_password": new_password,
                "new_password": password,
                "confirm_new_password": password,
            },
        )


if __name__ == "__main__":
    asyncio.run(test_change_password())
