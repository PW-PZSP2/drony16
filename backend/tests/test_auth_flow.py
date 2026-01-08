import pytest
import asyncio
import httpx

BASE_URL = "http://localhost:8080"


@pytest.mark.asyncio
async def test_auth_flow():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        print("Registering user...")
        response = await client.post(
            "/register",
            json={
                "email": "test@example.com",
                "password": "password123",
                "user_name": "test_user",
                "phone_number": "123456789",
                "role": "cli",
            },
        )
        if response.status_code == 400 and "Email already registered" in response.text:
            print("User already registered, proceeding to login.")
        else:
            assert response.status_code == 200, f"Registration failed: {response.text}"
            print("Registration successful.")

        print("Logging in...")
        response = await client.post(
            "/token", data={"username": "test@example.com", "password": "password123"}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        print("Login successful, cookie set.")

        print("Accessing protected route...")
        response = await client.get("/users/me")
        assert response.status_code == 200, (
            f"Access to protected route failed: {response.text}"
        )
        data = response.json()
        assert data["email"] == "test@example.com"
        assert "cli" in data["roles"]
        print(
            f"Protected route accessed successfully. User: {data['email']}, Roles: {data['roles']}"
        )


if __name__ == "__main__":
    asyncio.run(test_auth_flow())
