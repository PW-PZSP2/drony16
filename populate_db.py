import requests
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8080"


def get_session():
    return requests.Session()


def register_user(session, user_data):
    try:
        resp = session.post(f"{BASE_URL}/register", json=user_data)
        if resp.status_code == 400 and "already registered" in resp.text:
            print(f"User {user_data['email']} already exists. Skipping registration.")
        elif resp.status_code != 200:
            print(f"Failed to register {user_data['email']}: {resp.text}")
            return None
        else:
            print(f"Registered {user_data['email']}")

        login_data = {"username": user_data["email"], "password": user_data["password"]}
        resp = session.post(f"{BASE_URL}/token", data=login_data)
        if resp.status_code == 200:
            print(f"Logged in as {user_data['email']}")
            return True
        else:
            print(f"Failed to login {user_data['email']}: {resp.text}")
            return False
    except Exception as e:
        print(f"Error handling user {user_data['email']}: {e}")
        return False


def create_order(session, order_data):
    resp = session.post(f"{BASE_URL}/orders", json=order_data)
    if resp.status_code == 200:
        order = resp.json()
        print(f"Created Order '{order['name']}' (ID: {order['order_id']})")
        return order["order_id"]
    else:
        print(f"Failed to create order '{order_data['name']}': {resp.text}")
        return None


def main():
    print("Starting database population...")

    users = {
        "client": {
            "email": "client@example.com",
            "password": "string",
            "user_name": "Demo Client",
            "role": "cli",
            "phone_number": "123456789",
        },
        "op1": {
            "email": "op1@example.com",
            "password": "string",
            "user_name": "Demo Operator 1",
            "role": "ope",
            "phone_number": "987654321",
            "localisation": "Warsaw, Center",
            "area": 50,
        },
        "op2": {
            "email": "op2@example.com",
            "password": "string",
            "user_name": "Demo Operator 2",
            "role": "ope",
            "phone_number": "456123789",
            "localisation": "Warsaw, North",
            "area": 100,
        },
        "admin": {
            "email": "admin@example.com",
            "password": "string",
            "user_name": "Demo Admin",
            "role": "adm",
            "phone_number": "999888777",
        },
    }

    sessions = {}

    for key, data in users.items():
        sess = get_session()
        if register_user(sess, data):
            sessions[key] = sess
            resp = sess.get(f"{BASE_URL}/users/me")
            if resp.status_code == 200:
                users[key]["id"] = resp.json()["user_id"]
            else:
                print(f"Could not get ID for {key}")

    if "client" not in sessions:
        print("Client session missing. Aborting.")
        return

    client_sess = sessions["client"]

    orders_info = [
        {
            "name": "Zlecenie A - Sesja ślubna",
            "description": "Sesja w plenerze, potrzebny dron z kamerą 4K.",
            "location": "Łazienki Królewskie, Warszawa",
            "raid_date": True,  # 1
            "completion_date": False,  # 0
            "deadline": (datetime.now() + timedelta(days=30)).isoformat(),
            "services": [{"service_name": "Film", "parameters": {}}],
        },
        {
            "name": "Zlecenie B - Dron nad budową",
            "description": "Inspekcja postępów prac na budowie osiedla.",
            "location": "Wola, Warszawa",
            "raid_date": True,
            "completion_date": False,
            "deadline": (datetime.now() + timedelta(days=14)).isoformat(),
            "services": [{"service_name": "Ortofotomapa", "parameters": {}}],
        },
        {
            "name": "Zlecenie C - Inspekcja paneli",
            "description": "Sprawdzenie stanu technicznego paneli fotowoltaicznych.",
            "location": "Marki, Polska",
            "raid_date": True,
            "completion_date": False,
            "deadline": (datetime.now() + timedelta(days=7)).isoformat(),
            "services": [{"service_name": "Film", "parameters": {}}],
        },
        {
            "name": "Zlecenie D - Promocja Dewelopera",
            "description": "Film promocyjny nowej inwestycji.",
            "location": "Mokotów, Warszawa",
            "raid_date": True,
            "completion_date": False,
            "deadline": (datetime.now() + timedelta(days=60)).isoformat(),
            "services": [{"service_name": "Film", "parameters": {}}],
        },
        {
            "name": "Zlecenie E - Mapa 3D Terenu",
            "description": "Stworzenie modelu 3D pod projekt architektoniczny.",
            "location": "Wilanów, Warszawa",
            "raid_date": False,
            "completion_date": True,
            "deadline": (datetime.now() + timedelta(days=10)).isoformat(),
            "services": [{"service_name": "Modele 3D", "parameters": {}}],
        },
    ]

    order_ids = {}

    for i, o_data in enumerate(orders_info):
        oid = create_order(client_sess, o_data)
        if oid:
            order_ids[i] = oid

    if 1 in order_ids and "op1" in sessions:
        resp = sessions["op1"].post(f"{BASE_URL}/orders/{order_ids[1]}/interest")
        print(f"Op1 applied to Order B: {resp.status_code}")

    if 2 in order_ids:
        if "op1" in sessions:
            sessions["op1"].post(f"{BASE_URL}/orders/{order_ids[2]}/interest")
            print("Op1 applied to Order C")
        if "op2" in sessions:
            sessions["op2"].post(f"{BASE_URL}/orders/{order_ids[2]}/interest")
            print("Op2 applied to Order C")

    if 3 in order_ids and "op1" in sessions:
        sessions["op1"].post(f"{BASE_URL}/orders/{order_ids[3]}/interest")
        op1_id = users["op1"]["id"]

        resp = client_sess.post(f"{BASE_URL}/orders/{order_ids[3]}/select/{op1_id}")
        if resp.status_code == 200:
            print("Client selected Op1 for Order D (In Progress)")
        else:
            print(f"Failed to select op for Order D: {resp.text}")

    if 4 in order_ids and "op2" in sessions:
        sessions["op2"].post(f"{BASE_URL}/orders/{order_ids[4]}/interest")
        op2_id = users["op2"]["id"]

        resp = client_sess.post(f"{BASE_URL}/orders/{order_ids[4]}/select/{op2_id}")
        if resp.status_code == 200:
            print("Client selected Op2 for Order E")
            # Complete
            resp_comp = client_sess.post(f"{BASE_URL}/orders/{order_ids[4]}/complete")
            if resp_comp.status_code == 200:
                print("Client completed Order E (Finished)")
            else:
                print(f"Failed to complete Order E: {resp_comp.text}")

    print("\nDatabase population finished.")
    print("Logins:")
    print(f"Client: {users['client']['email']} / {users['client']['password']}")
    print(f"Op1:    {users['op1']['email']} / {users['op1']['password']}")
    print(f"Op2:    {users['op2']['email']} / {users['op2']['password']}")
    print(f"Admin:  {users['admin']['email']} / {users['admin']['password']}")


if __name__ == "__main__":
    main()
