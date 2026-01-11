import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateOrderTab from "./CreateOrderTab";
import { create_order } from "@/services/client_service";
import userEvent from "@testing-library/user-event";

// Mock the client service
jest.mock("@/services/client_service", () => ({
  create_order: jest.fn(),
}));

// Mock ServiceParameters to keep test focused
jest.mock(
  "@/components/feature/client_dashboard/elements/ServiceParameters",
  () => {
    return function DummyServiceParameters({ service }: { service: string }) {
      return (
        <div data-testid="service-parameters">Parametry dla {service}</div>
      );
    };
  },
);

describe("CreateOrderTab", () => {
  const mockAlert = jest.fn();

  beforeAll(() => {
    // Mock window.alert
    Object.defineProperty(window, "alert", {
      writable: true,
      value: mockAlert,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields", () => {
    render(<CreateOrderTab />);
    expect(screen.getByText(/Tytuł zlecenia/i)).toBeInTheDocument();
    expect(screen.getByText(/Rodzaj usługi/i)).toBeInTheDocument();
    expect(screen.getByText(/Lokalizacja/i)).toBeInTheDocument();
    expect(screen.getByText(/Opis zlecenia/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Opublikuj zlecenie/i }),
    ).toBeInTheDocument();
  });

  it("allows filling form and submitting", async () => {
    const user = userEvent.setup();
    // Mock successful creation
    (create_order as jest.Mock).mockResolvedValue({
      success: true,
      orderId: 123,
    });

    const { container } = render(<CreateOrderTab />);

    // Fill Title
    const titleInput = screen.getByPlaceholderText(/np. Ortofotomapa/i);
    fireEvent.change(titleInput, { target: { value: "Moje nowe zlecenie" } });

    // Select Service (Film)
    const filmServiceLabel = screen.getByText("Film");
    await user.click(filmServiceLabel);

    // Verify service parameters appeared
    expect(screen.getByTestId("service-parameters")).toHaveTextContent(
      "Parametry dla Film",
    );

    // Fill Location
    const locationInput = screen.getByPlaceholderText(
      /Wpisz adres lub współrzędne/i,
    );
    fireEvent.change(locationInput, { target: { value: "Warszawa, Centrum" } });

    // Fill Deadline (Use direct selector based on name or label)
    const deadlineInput = container.querySelector('input[type="date"]');
    if (!deadlineInput) throw new Error("Deadline input not found");
    fireEvent.change(deadlineInput, { target: { value: "2025-10-10" } });

    // Fill Description
    const descArea = screen.getByPlaceholderText(/Opisz szczegóły zlecenia/i);
    fireEvent.change(descArea, {
      target: { value: "Potrzebuję nagrania z drona." },
    });

    // Submit
    const submitBtn = screen.getByRole("button", {
      name: /Opublikuj zlecenie/i,
    });
    await user.click(submitBtn);

    // Verify simulate submission state
    // The component conditionally renders "Wysyłanie..." replacing the form,
    // then renders the form again after response.

    // Wait for create_order needed
    await waitFor(() => {
      expect(create_order).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Moje nowe zlecenie",
          service: "Film",
          location: "Warszawa, Centrum",
          deadline: "2025-10-10",
          description: "Potrzebuję nagrania z drona.",
          deadlineType: "flight", // default
        }),
      );
    });

    // Verify alert
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining("pomyślnie"),
      );
    });
  });

  it("handles submission error", async () => {
    const user = userEvent.setup();
    (create_order as jest.Mock).mockResolvedValue({
      success: false,
      message: "Server error",
    });

    const { container } = render(<CreateOrderTab />);

    await user.type(
      screen.getByPlaceholderText(/np. Ortofotomapa/i),
      "Test Error",
    );
    await user.type(screen.getByPlaceholderText(/Wpisz adres/i), "Loc");

    const deadlineInput = container.querySelector('input[type="date"]');
    if (!deadlineInput) throw new Error("Deadline input not found");
    fireEvent.change(deadlineInput, { target: { value: "2025-01-01" } });

    await user.type(screen.getByPlaceholderText(/Opisz szczegóły/i), "Desc");

    const submitBtn = screen.getByRole("button", {
      name: /Opublikuj zlecenie/i,
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(create_order).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        expect.stringContaining("Błąd podczas tworzenia"),
      );
    });
  });
});
