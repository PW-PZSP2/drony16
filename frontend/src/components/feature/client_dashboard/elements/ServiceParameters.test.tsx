import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ServiceParameters from "./ServiceParameters";

describe("ServiceParameters", () => {
  it("renders empty when no service matches", () => {
    const { container } = render(<ServiceParameters service="unknown" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders Ortofoto parameters", () => {
    render(<ServiceParameters service="ortofoto" />);
    expect(screen.getByText(/Parametry ortofotomapy/i)).toBeInTheDocument();
    expect(screen.getByText(/GSD/i)).toBeInTheDocument();
  });

  it("renders Terrain parameters", () => {
    render(<ServiceParameters service="terrain" />);
    expect(screen.getByText(/Parametry modelu terenu/i)).toBeInTheDocument();
    expect(screen.getByText(/Format wyjściowy/i)).toBeInTheDocument();
  });

  it("renders Pointcloud parameters", () => {
    render(<ServiceParameters service="pointcloud" />);
    expect(screen.getByText(/Parametry chmury punktów/i)).toBeInTheDocument();
    expect(screen.getByText(/Gęstość punktów/i)).toBeInTheDocument();
  });

  it("renders 3D parameters", () => {
    render(<ServiceParameters service="3d" />);
    expect(screen.getByText(/Parametry modelu 3D/i)).toBeInTheDocument();
    expect(screen.getByText(/Jakość tekstur/i)).toBeInTheDocument();
  });

  it("renders Laser parameters", () => {
    render(<ServiceParameters service="laser" />);
    expect(
      screen.getByText(/Parametry skaningu laserowego/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Zasięg skanowania/i)).toBeInTheDocument();
  });
});
