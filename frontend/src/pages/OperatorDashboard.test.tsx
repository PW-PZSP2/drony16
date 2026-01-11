import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OperatorDashboard from "./OperatorDashboard";
import { MemoryRouter } from "react-router-dom";
import { OperatorService } from "@/services/operator_service";
import userEvent from "@testing-library/user-event";

// Mock OperatorService
jest.mock("@/services/operator_service", () => ({
  OperatorService: {
    getOperatorAverageScore: jest.fn().mockResolvedValue(4.5),
    createService: jest.fn(),
    deleteService: jest.fn(),
    updateLocalisation: jest.fn(),
    updateArea: jest.fn(),
    getServices: jest
      .fn()
      .mockResolvedValue([{ id: 1, name: "Video", price: 100 }]),
    getMatchedOrders: jest.fn(),
    getAssignedOrders: jest.fn(),
    getOrderHistory: jest.fn(),
    applyForOrder: jest.fn(),
    fetchAttachments: jest.fn().mockResolvedValue([]),
  },
}));

const mockOrder = {
  order_id: 101,
  client_id: 1,
  name: "Test Order 1",
  description: "Description 1",
  creation_date: "2025-01-01",
  raid_date: "2025-01-10",
  deadline: "2025-01-10",
  location: "Warszawa",
  status: "pending",
  services: [{ service_id: 1, service_name: "Video" }],
  has_applied: false,
};

const mockAssignedOrder = {
  ...mockOrder,
  order_id: 102,
  name: "Assigned Order",
  status: "in_progress",
};

const mockHistoryOrder = {
  ...mockOrder,
  order_id: 103,
  name: "History Order",
  status: "completed",
  has_applied: true,
};

describe("OperatorDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (OperatorService.getMatchedOrders as jest.Mock).mockResolvedValue([]);
    (OperatorService.getAssignedOrders as jest.Mock).mockResolvedValue([]);
    (OperatorService.getOrderHistory as jest.Mock).mockResolvedValue([]);
  });

  it("renders dashboard default state (empty)", async () => {
    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Panel Operatora/i)).toBeInTheDocument();
    // Default tab is "Nowe zlecenia"
    await waitFor(() => {
      expect(
        screen.getByText(/Brak nowych pasujących zleceń/i),
      ).toBeInTheDocument();
    });
  });

  it("renders matched orders in New Orders tab and handles application", async () => {
    (OperatorService.getMatchedOrders as jest.Mock).mockResolvedValue([
      mockOrder,
    ]);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Order 1")).toBeInTheDocument();
    });

    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText(/Warszawa/i)).toBeInTheDocument();

    // Apply for order
    const applyBtn = screen.getByRole("button", { name: /Zgłoś się/i });
    await user.click(applyBtn);

    await waitFor(() => {
      expect(OperatorService.applyForOrder).toHaveBeenCalledWith(101);
    });
  });

  it('shows order details when "See Details" is clicked', async () => {
    (OperatorService.getMatchedOrders as jest.Mock).mockResolvedValue([
      mockOrder,
    ]);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Test Order 1")).toBeInTheDocument();
    });

    const detailsBtn = screen.getByRole("button", {
      name: /Zobacz szczegóły/i,
    });
    await user.click(detailsBtn);

    await waitFor(() => {
      expect(screen.getByText(/Szczegóły zlecenia/i)).toBeInTheDocument();
      expect(screen.getByText(/Description 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Termin nalotu/i)).toBeInTheDocument();
    });

    // Click Back
    const backBtn = screen.getByRole("button", { name: /Wróć do listy/i });
    await user.click(backBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Szczegóły zlecenia/i)).not.toBeInTheDocument();
      expect(screen.getByText("Test Order 1")).toBeInTheDocument();
    });
  });

  it("renders assigned orders in Confirmed tab", async () => {
    (OperatorService.getAssignedOrders as jest.Mock).mockResolvedValue([
      mockAssignedOrder,
    ]);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>,
    );

    // Switch to Confirmed tab
    const confirmedTab = screen.getByRole("tab", { name: /Potwierdzone/i });
    await user.click(confirmedTab);

    await waitFor(() => {
      expect(screen.getByText("Assigned Order")).toBeInTheDocument();
      expect(screen.getByText(/W trakcie/i)).toBeInTheDocument();
    });
    expect(OperatorService.getAssignedOrders).toHaveBeenCalled();
  });

  it("renders history orders in History tab", async () => {
    (OperatorService.getOrderHistory as jest.Mock).mockResolvedValue([
      mockHistoryOrder,
    ]);
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>,
    );

    // Switch to History tab
    const historyTab = screen.getByRole("tab", { name: /Historia/i });
    await user.click(historyTab);

    await waitFor(() => {
      expect(screen.getByText("History Order")).toBeInTheDocument();
      expect(screen.getByText(/Zakończone/i)).toBeInTheDocument();
    });
    expect(OperatorService.getOrderHistory).toHaveBeenCalled();
  });

  it("handles service errors gracefully", async () => {
    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (OperatorService.getMatchedOrders as jest.Mock).mockRejectedValue(
      new Error("Fetch error"),
    );

    render(
      <MemoryRouter>
        <OperatorDashboard />
      </MemoryRouter>,
    );

    // Should not crash, just show empty or stick to loading state?
    // Code sets loading=false finally.
    await waitFor(() => {
      // If error, it might show "Brak zleceń..." because orders [] is empty default.
      // Or stay empty.
      // Verification is that it rendered without exploding.
      expect(screen.getByText(/Panel Operatora/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
