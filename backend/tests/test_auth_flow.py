import asyncio
import httpx

BASE_URL = "http://localhost:8080"


async def test_auth_flow():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        print("Registering user...")
        response = await client.post(
            "/register", json={"email": "test@example.com", "password": "password123"}
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
        token_data = response.json()
        access_token = token_data["access_token"]
        print("Login successful, token received.")

        print("Accessing protected route...")
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await client.get("/users/me", headers=headers)
        assert (
            response.status_code == 200
        ), f"Access to protected route failed: {response.text}"
        user_data = response.json()
        assert user_data["email"] == "test@example.com"
        print(f"Protected route accessed successfully. User: {user_data['email']}")


if __name__ == "__main__":
    asyncio.run(test_auth_flow())
