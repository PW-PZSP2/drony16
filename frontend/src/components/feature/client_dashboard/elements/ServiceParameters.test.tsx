import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ServiceParameters from "./ServiceParameters";

describe("ServiceParameters", () => {
  it("renders empty when no service matches", () => {
    const mockOnParametersChange = jest.fn();
    const { container } = render(
      <ServiceParameters
        service="unknown"
        parameters={{}}
        onParametersChange={mockOnParametersChange}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Ortofoto parameters", () => {
    const mockOnParametersChange = jest.fn();
    render(
      <ServiceParameters
        service="ortofoto"
        parameters={{}}
        onParametersChange={mockOnParametersChange}
      />,
    );
    expect(screen.getByText(/Parametry ortofotomapy/i)).toBeInTheDocument();
    expect(screen.getByText(/GSD/i)).toBeInTheDocument();
  });

  it("renders Terrain parameters", () => {
    const mockOnParametersChange = jest.fn();
    render(
      <ServiceParameters
        service="terrain"
        parameters={{}}
        onParametersChange={mockOnParametersChange}
      />,
    );
    expect(screen.getByText(/Parametry modelu terenu/i)).toBeInTheDocument();
    expect(screen.getByText(/Format wyjściowy/i)).toBeInTheDocument();
  });

  it("renders Pointcloud parameters", () => {
    const mockOnParametersChange = jest.fn();
    render(
      <ServiceParameters
        service="pointcloud"
        parameters={{}}
        onParametersChange={mockOnParametersChange}
      />,
    );
    expect(screen.getByText(/Parametry chmury punktów/i)).toBeInTheDocument();
    expect(screen.getByText(/Gęstość punktów/i)).toBeInTheDocument();
  });

  it("renders 3D parameters", () => {
    const mockOnParametersChange = jest.fn();
    render(
      <ServiceParameters
        service="3d"
        parameters={{}}
        onParametersChange={mockOnParametersChange}
      />,
    );
    expect(screen.getByText(/Parametry modelu 3D/i)).toBeInTheDocument();
    expect(screen.getByText(/Jakość tekstur/i)).toBeInTheDocument();
  });

  it("renders Laser parameters", () => {
    const mockOnParametersChange = jest.fn();
    render(
      <ServiceParameters
        service="laser"
        parameters={{}}
        onParametersChange={mockOnParametersChange}
      />,
    );
    expect(
      screen.getByText(/Parametry skaningu laserowego/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Zasięg skanowania/i)).toBeInTheDocument();
  });
});
