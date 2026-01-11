import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SelectedOperatorTab from "./SelectedOperatorTab";
import { fetch_current_orders } from "@/services/client_service";
import userEvent from "@testing-library/user-event";

// Mock dependencies
jest.mock("@/services/client_service", () => ({
  fetch_current_orders: jest.fn(),
}));

// Mock the child component to avoid deep rendering and complex service mocks
jest.mock("@/components/feature/client_dashboard/elements/OrderDetails", () => {
  return function MockOrderDetails({
    order,
    onBack,
  }: {
    order: any;
    onBack: () => void;
  }) {
    return (
      <div data-testid="order-details">
        <h2>Details for {order.title}</h2>
        <button onClick={onBack}>Back</button>
      </div>
    );
  };
});

const mockOrders = [
  {
    id: 1,
    title: "Order A",
    service: "Video",
    location: "Warsaw",
    deadline: "2025-01-01",
    deadlineType: "completion",
    applicants: 3,
  },
  {
    id: 2,
    title: "Order B",
    service: "Photo",
    location: "Krakow",
    deadline: "2025-02-01",
    deadlineType: "flight",
    applicants: 0,
  },
];

describe("SelectedOperatorTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (fetch_current_orders as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolves
    render(<SelectedOperatorTab />);
    expect(screen.getByText(/Ładowanie zleceń/i)).toBeInTheDocument();
  });

  it("renders list of orders when data is fetched", async () => {
    (fetch_current_orders as jest.Mock).mockResolvedValue(mockOrders);
    render(<SelectedOperatorTab />);

    await waitFor(() => {
      expect(screen.queryByText(/Ładowanie zleceń/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Order A")).toBeInTheDocument();
    expect(screen.getByText("Order B")).toBeInTheDocument();
    expect(screen.getByText("3 zgłoszeń operatorów")).toBeInTheDocument();
    expect(screen.getByText(/Warsaw/i)).toBeInTheDocument();
  });

  it("renders empty state when no orders", async () => {
    (fetch_current_orders as jest.Mock).mockResolvedValue([]);
    render(<SelectedOperatorTab />);

    await waitFor(() => {
      expect(screen.getByText(/Brak zleceń oczekujących/i)).toBeInTheDocument();
    });
  });

  it("handles error state", async () => {
    (fetch_current_orders as jest.Mock).mockRejectedValue(new Error("Fail"));
    render(<SelectedOperatorTab />);

    await waitFor(() => {
      expect(screen.getByText(/Błąd ładowania zleceń/i)).toBeInTheDocument();
    });
  });

  it("navigates to details and back", async () => {
    (fetch_current_orders as jest.Mock).mockResolvedValue(mockOrders);
    const user = userEvent.setup();
    render(<SelectedOperatorTab />);

    await waitFor(() => {
      expect(screen.getByText("Order A")).toBeInTheDocument();
    });

    // Click "Wybierz operatora" (both buttons do same logic: setSelectedOrder)
    const selectBtn = screen.getAllByText(/Wybierz operatora/i)[0];
    await user.click(selectBtn);

    await waitFor(() => {
      expect(screen.getByTestId("order-details")).toBeInTheDocument();
      expect(screen.getByText("Details for Order A")).toBeInTheDocument();
    });

    // Click Back (mocked)
    await user.click(screen.getByText("Back"));

    await waitFor(() => {
      expect(screen.queryByTestId("order-details")).not.toBeInTheDocument();
      expect(screen.getByText("Order A")).toBeInTheDocument();
    });
  });
});
