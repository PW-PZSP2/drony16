import type { User } from "../types/auth/user";

interface LoginPasswordCredentials {
  username: string;
  password: string;
}

const API_URL = "http://localhost:8080";

async function login(
  credentials: LoginPasswordCredentials,
): Promise<User | null> {
  const formData = new FormData();
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);

  try {
    const response = await fetch(`${API_URL}/token`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    return getCurrentUser();
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
}

interface RegisterPayload {
  user_name: string;
  email: string;
  password?: string;
  role: string;
  phone_number: string;
  localisation?: string;
  area?: number;
}

async function register(userData: RegisterPayload): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Registration failed");
    }

    return response.json();
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      credentials: "include",
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    return null;
  }
}

export const AuthService = {
  login,
  logout,
  register,
  getCurrentUser,
};
