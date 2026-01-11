import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RegisterForm } from "./RegisterForm";
import { AuthService } from "@/services/authorization_service";
import userEvent from "@testing-library/user-event";
import { Roles } from "@/types/auth/user_role";

// Mock AuthService
jest.mock("@/services/authorization_service", () => ({
  AuthService: {
    register: jest.fn(),
  },
}));

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders basic fields for Client by default", () => {
    render(<RegisterForm />);
    expect(screen.getByText(/Utwórz konto/i)).toBeInTheDocument();
    // Check for role buttons
    expect(screen.getByRole("button", { name: /Klient/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Operator/i }),
    ).toBeInTheDocument();

    // Check common fields
    expect(screen.getByLabelText(/Nazwa użytkownika/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Numer telefonu/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Hasło/i)).toBeInTheDocument(); // regex to match Hasło but not Potwierdź hasło if similar
    expect(screen.getByLabelText(/Potwierdź hasło/i)).toBeInTheDocument();

    // Operator specific fields should NOT be present
    expect(screen.queryByLabelText(/Lokalizacja/i)).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/Zasięg działania/i),
    ).not.toBeInTheDocument();
  });

  it("shows extra fields when Operator role is selected", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const operatorBtn = screen.getByRole("button", { name: /Operator/i });
    await user.click(operatorBtn);

    expect(screen.getByLabelText(/Lokalizacja/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zasięg działania/i)).toBeInTheDocument();
  });

  it("validates password match", async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/^Hasło/i), "password123");
    await user.type(screen.getByLabelText(/Potwierdź hasło/i), "mismatch123");

    const submitBtn = screen.getByRole("button", { name: /Zarejestruj się/i });
    await user.click(submitBtn);

    // Validation error should appear
    expect(
      await screen.findByText(/Hasła nie są identyczne/i),
    ).toBeInTheDocument();
    expect(AuthService.register).not.toHaveBeenCalled();
  });

  it("submits valid form for Client", async () => {
    const user = userEvent.setup();
    const mockUser = { id: 1, email: "jan@example.com", role: Roles.CLIENT };
    (AuthService.register as jest.Mock).mockResolvedValue(mockUser);

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/Nazwa użytkownika/i), "janek");
    await user.type(screen.getByLabelText(/Email/i), "jan@example.com");
    await user.type(screen.getByLabelText(/Numer telefonu/i), "123456789");
    await user.type(screen.getByLabelText(/^Hasło/i), "password123");
    await user.type(screen.getByLabelText(/Potwierdź hasło/i), "password123");

    const submitBtn = screen.getByRole("button", { name: /Zarejestruj się/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith({
        user_name: "janek",
        email: "jan@example.com",
        phone_number: "123456789",
        password: "password123",
        role: Roles.CLIENT,
        localisation: "",
        area: undefined,
      });
    });

    expect(
      await screen.findByText(/Konto utworzone pomyślnie/i),
    ).toBeInTheDocument();
  });

  it("submits valid form for Operator", async () => {
    const user = userEvent.setup();
    const mockUser = { id: 2, email: "op@example.com", role: Roles.OPERATOR };
    (AuthService.register as jest.Mock).mockResolvedValue(mockUser);

    render(<RegisterForm />);

    // Switch to Operator
    await user.click(screen.getByRole("button", { name: /Operator/i }));

    await user.type(screen.getByLabelText(/Nazwa użytkownika/i), "operator1");
    await user.type(screen.getByLabelText(/Email/i), "op@example.com");
    await user.type(screen.getByLabelText(/Numer telefonu/i), "987654321");
    await user.type(screen.getByLabelText(/Lokalizacja/i), "Warszawa");
    await user.type(screen.getByLabelText(/Zasięg działania/i), "50");
    await user.type(screen.getByLabelText(/^Hasło/i), "password123");
    await user.type(screen.getByLabelText(/Potwierdź hasło/i), "password123");

    const submitBtn = screen.getByRole("button", { name: /Zarejestruj się/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(AuthService.register).toHaveBeenCalledWith({
        user_name: "operator1",
        email: "op@example.com",
        phone_number: "987654321",
        password: "password123",
        role: Roles.OPERATOR,
        localisation: "Warszawa",
        area: 50,
      });
    });
  });

  it("handles registration error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const user = userEvent.setup();
    (AuthService.register as jest.Mock).mockRejectedValue(
      new Error("Email zajęty"),
    );

    render(<RegisterForm />);

    // Fill minimal valid
    await user.type(screen.getByLabelText(/Nazwa użytkownika/i), "janek");
    await user.type(screen.getByLabelText(/Email/i), "exist@example.com");
    await user.type(screen.getByLabelText(/Numer telefonu/i), "123456789");
    await user.type(screen.getByLabelText(/^Hasło/i), "password123");
    await user.type(screen.getByLabelText(/Potwierdź hasło/i), "password123");

    await user.click(screen.getByRole("button", { name: /Zarejestruj się/i }));

    await waitFor(() => {
      expect(screen.getByText(/Błąd rejestracji/i)).toBeInTheDocument();
      expect(screen.getByText(/Email zajęty/i)).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Registration error:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
