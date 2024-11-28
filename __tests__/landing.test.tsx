import { createRemixStub } from "@remix-run/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it } from "vitest";
import LandingPage from "~/routes/_index";

describe("Home Page", () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      Component: LandingPage,
    },
  ]);
  render(<RemixStub />);

  it("should render the page title", async () => {
    await waitFor(() => screen.getByText(/organize memories/i));
  });
});
