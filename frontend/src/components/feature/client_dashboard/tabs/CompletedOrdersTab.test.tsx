import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CompletedOrdersTab from "./CompletedOrdersTab";
import { fetch_completed_orders } from "@/services/client_service";

// Mock client service
jest.mock("@/services/client_service", () => ({
  fetch_completed_orders: jest.fn(),
}));

describe("CompletedOrdersTab", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    // Mock infinite pending to see loading state
    (fetch_completed_orders as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    );
    render(<CompletedOrdersTab />);
    expect(
      screen.getByText(/Ładowanie zakończonych zleceń/i),
    ).toBeInTheDocument();
  });

  it("renders orders when loaded", async () => {
    const mockOrders = [
      {
        id: 1,
        title: "Test Order 1",
        service: "Video",
        status: "completed",
        completedDate: "2023-01-01",
        selectedOperator: "Op1",
        location: "Warsaw",
      },
    ];
    (fetch_completed_orders as jest.Mock).mockResolvedValue(mockOrders);

    render(<CompletedOrdersTab />);

    await waitFor(() => {
      expect(screen.getByText("Test Order 1")).toBeInTheDocument();
    });
  });
});
