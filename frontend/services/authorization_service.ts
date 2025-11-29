import { User } from "../types/auth/user";
import { Roles } from "../types/auth/user_role";

interface LoginPasswordCredentials { 
    username: string;
    password: string;
}


const mockUser: User = {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    role: [Roles.ADMIN, Roles.OPERATOR]
};

async function login(credentials: LoginPasswordCredentials): Promise<User> {
    
    return Promise.resolve(mockUser);
}

async function logout(): Promise<void> {
    return Promise.resolve();
}

async function register(userData: Partial<User> & { password: string }): Promise<User> {
    return mockUser;
}

async function getCurrentUser(): Promise<User | null> {
    return Promise.resolve(mockUser);
}

export const AuthService = {
    login: login,
    logout: logout,
    register: register,
    getCurrentUser: getCurrentUser,
};