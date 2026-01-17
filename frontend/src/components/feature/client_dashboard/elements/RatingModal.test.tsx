import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RatingModal from "./RatingModal";
import userEvent from "@testing-library/user-event";

// Mock the service
jest.mock("@/services/client_service", () => ({
  rate_order: jest.fn(),
}));

import { rate_order } from "@/services/client_service";

describe("RatingModal", () => {
  // Mock window.alert
  beforeAll(() => {
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    (rate_order as jest.Mock).mockResolvedValue({ success: true });
  });

  it("renders correctly", () => {
    render(<RatingModal orderId={1} onClose={() => {}} />);
    expect(screen.getByText(/Oceń wykonaną pracę/i)).toBeInTheDocument();
    expect(screen.getByText(/Status zlecenia/i)).toBeInTheDocument();
  });

  it("validates status selection before submission", async () => {
    const onClose = jest.fn();
    render(<RatingModal orderId={1} onClose={onClose} />);

    const submitBtn = screen.getByRole("button", { name: /Zapisz ocenę/i });

    // Button is disabled until status and rating selected?
    // Logic: disabled={completed === null || (completed && rating === 0)}
    expect(submitBtn).toBeDisabled();
  });

  it('allows submission when "Not Completed" is selected', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<RatingModal orderId={1} onClose={onClose} />);

    // Click "Nie zostało wykonane"
    await user.click(screen.getByLabelText(/Nie zostało wykonane/i));

    const submitBtn = screen.getByRole("button", { name: /Zapisz ocenę/i });
    expect(submitBtn).not.toBeDisabled();

    await user.click(submitBtn);

    expect(window.alert).toHaveBeenCalledWith("Ocena została zapisana!");
    expect(onClose).toHaveBeenCalled();
  });

  it('requires rating when "Completed" is selected', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<RatingModal orderId={1} onClose={onClose} />);

    // Click "Zostało wykonane"
    await user.click(screen.getByLabelText(/^Zostało wykonane/i));

    // Rating stars appear
    expect(screen.getByText(/Ocena \(1-5 gwiazdek\)/i)).toBeInTheDocument();
    const submitBtn = screen.getByRole("button", { name: /Zapisz ocenę/i });

    // Still disabled because rating is 0 by default?
    expect(submitBtn).toBeDisabled();

    // Click 5th star
    // Stars are buttons. We can find by class or just all buttons in that section.
    // The code maps 1..5 to buttons.
    // Let's find buttons inside the rating container (tricky without test id).
    // Or find by index.
    // Click 5th star
    const star5 = screen.getByLabelText("Ocena 5");
    await user.click(star5);

    expect(submitBtn).not.toBeDisabled();

    // Fill comment
    await user.type(
      screen.getByPlaceholderText(/Podziel się swoją opinią/i),
      "Great job!",
    );

    await user.click(submitBtn);

    expect(window.alert).toHaveBeenCalledWith("Ocena została zapisana!");
    expect(onClose).toHaveBeenCalled();
  });

  it("closes on cancel", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(<RatingModal orderId={1} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /Anuluj/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
