import WithProvider from "@app/_components/hocs/WithProvider";
import Footer from "@components/HomeModule/Footer";
import Hero from "@components/HomeModule/Hero";
import Navbar from "@components/HomeModule/Navbar";
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
