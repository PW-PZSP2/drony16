import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import OrderDetails from "./OrderDetails";
import {
  fetch_order_applicants,
  select_operator,
} from "@/services/client_service";
import userEvent from "@testing-library/user-event";

// Mock dependencies
jest.mock("@/services/client_service", () => ({
  fetch_order_applicants: jest.fn(),
  select_operator: jest.fn(),
}));

const mockOrder = {
  id: 1,
  title: "Test Order",
  service: "Video",
  location: "Warsaw",
  deadline: "2025-01-01",
  deadlineType: "completion" as const,
  description: "Desc",
  applicants: 2,
};

const mockApplicants = [
  {
    id: 101,
    name: "Operator 1",
    rating: 4.5,
    completedJobs: 10,
    description: "Exp operator",
    equipment: ["Drone A"],
  },
  {
    id: 102,
    name: "Operator 2",
    rating: 5.0,
    completedJobs: 5,
    description: "New operator",
    equipment: ["Drone B"],
  },
];

describe("OrderDetails", () => {
  beforeAll(() => {
    window.alert = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders order basic info", () => {
    (fetch_order_applicants as jest.Mock).mockReturnValue(
      new Promise(() => {}),
    );
    render(<OrderDetails order={mockOrder} onBack={() => {}} />);
    expect(screen.getByText("Test Order")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText(/Oczekuje wyboru/i)).toBeInTheDocument();
  });

  it("fetches and displays applicants", async () => {
    (fetch_order_applicants as jest.Mock).mockResolvedValue(mockApplicants);
    render(<OrderDetails order={mockOrder} onBack={() => {}} />);

    // Loading state?
    expect(screen.getByText(/Ładowanie zgłoszeń/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/Ładowanie zgłoszeń/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText("Operator 1")).toBeInTheDocument();
    expect(screen.getByText("Operator 2")).toBeInTheDocument();
    expect(screen.getByText("Drone A")).toBeInTheDocument();
  });

  it("handles no applicants", async () => {
    (fetch_order_applicants as jest.Mock).mockResolvedValue([]);
    render(<OrderDetails order={mockOrder} onBack={() => {}} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Brak zgłoszeń dla tego zlecenia/i),
      ).toBeInTheDocument();
    });
  });

  it("selects operator successfully", async () => {
    (fetch_order_applicants as jest.Mock).mockResolvedValue(mockApplicants);
    (select_operator as jest.Mock).mockResolvedValue({ success: true });
    const onBack = jest.fn();
    const user = userEvent.setup();

    render(<OrderDetails order={mockOrder} onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByText("Operator 1")).toBeInTheDocument();
    });

    // Click "Wybierz operatora" for first applicant
    // There are multiple buttons with same text.
    const selectButtons = screen.getAllByRole("button", {
      name: /Wybierz operatora/i,
    });
    await user.click(selectButtons[0]);

    await waitFor(() => {
      expect(select_operator).toHaveBeenCalledWith(1, 101);
      expect(window.alert).toHaveBeenCalledWith(
        "Operator został wybrany pomyślnie.",
      );
      expect(onBack).toHaveBeenCalled();
    });
  });

  it("handles selection failure", async () => {
    (fetch_order_applicants as jest.Mock).mockResolvedValue(mockApplicants);
    (select_operator as jest.Mock).mockResolvedValue({
      success: false,
      message: "Fail",
    });
    const user = userEvent.setup();

    render(<OrderDetails order={mockOrder} onBack={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Operator 1")).toBeInTheDocument();
    });

    const selectButtons = screen.getAllByRole("button", {
      name: /Wybierz operatora/i,
    });
    await user.click(selectButtons[0]);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Fail");
    });
  });
});
