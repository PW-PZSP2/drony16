import type { User } from "../types/auth/user";
import { Roles } from "../types/auth/user_role";

interface LoginPasswordCredentials {
  username: string;
  password: string;
}

const mockUser: User = {
  username: "john_doe",
  email: "john@example.com",
  roles: [Roles.ADMIN, Roles.OPERATOR],
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function login(credentials: LoginPasswordCredentials): Promise<User> {
  await delay(2000);
  return Promise.resolve(mockUser);
}

async function logout(): Promise<void> {
  await delay(2000);
  return Promise.resolve();
}

async function register(
  userData: Partial<User> & { password: string },
): Promise<User> {
  await delay(2000);
  return Promise.resolve(mockUser);
}

async function getCurrentUser(): Promise<User | null> {
  await delay(2000);
  return Promise.resolve(mockUser);
}

export const AuthService = {
  login: login,
  logout: logout,
  register: register,
  getCurrentUser: getCurrentUser,
};
