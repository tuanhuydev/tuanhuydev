import Footer from "@lib/HomeModule/Footer";
import Hero from "@lib/HomeModule/Hero";
import Navbar from "@lib/HomeModule/Navbar";
import WithProvider from "@lib/components/hocs/WithProvider";
import { render, screen } from "@testing-library/react";

describe("Home Page test suit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should render navbar", () => {
    render(
      <WithProvider>
        <Navbar />
      </WithProvider>,
    );
    const headerElement = document.querySelector("header");
    expect(headerElement).toBeInTheDocument();
  });

  it("Should render hero section", async () => {
    render(<Hero />);
    const heroElement = await screen.findByTestId("homepage-about-me");
    expect(heroElement).toBeInTheDocument();
  });

  it("Should render footer", () => {
    render(<Footer />);
    const footerElement = document.querySelector("footer");
    expect(footerElement).toBeInTheDocument();
  });
});
