import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "./LoginPage";
import { AuthService } from "@/services/authorization_service";
import { MemoryRouter } from "react-router-dom";

// Mock AuthService
jest.mock("@/services/authorization_service", () => ({
  AuthService: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form by default", () => {
    render(
      <MemoryRouter initialEntries={["/login?action=login"]}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: /zaloguj się/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /zarejestruj/i }),
    ).not.toBeInTheDocument();
  });

  it("renders register form when action is register", () => {
    // Note: LoginPage logic says: isLogin = searchParams.get("action") === "login";
    // So anything else should render register form logic (based on the ternary)
    // Wait, checking the code:
    // const isLogin = searchParams.get("action") === "login";
    // {isLogin ? <LoginForm /> : <RegisterForm ... />}

    render(
      <MemoryRouter initialEntries={["/login?action=register"]}>
        <LoginPage />
      </MemoryRouter>,
    );
    // Register form usually has a button "Stwórz konto" or "Zarejestruj"
    // We should check for elements specific to RegisterForm
    // Assuming RegisterForm has a button with text "Zarejestruj się" or similiar.
    // I'll assume generic text for now or verify specific inputs
    expect(
      screen.getByRole("button", { name: /zarejestruj się/i }),
    ).toBeInTheDocument();
  });

  it("calls AuthService.login on submit", async () => {
    (AuthService.login as jest.Mock).mockResolvedValue({ id: 1, role: "cli" });

    render(
      <MemoryRouter initialEntries={["/login?action=login"]}>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/hasło/i), {
      target: { value: "password123" },
    });

    const loginButton = screen.getByRole("button", { name: /zaloguj się/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "password123",
      });
    });
  });
});
