import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest"; // Ensure Vitest is installed
import Dashboard from "~/routes/dashboard";
import type { UserWithAlbumCount } from "~/types";

describe("Dashboard", () => {
  const testData: UserWithAlbumCount[] = [
    {
      name: "John",
      albumCount: 4,
      email: "john@gmail.com",
      id: 1,
      username: "john",
    },
    {
      name: "Alice",
      albumCount: 5,
      email: "alice@gmail.com",
      id: 2,
      username: "alice",
    },
  ];

  const RemixStub = createRemixStub([
    {
      path: "/dashboard",
      Component: Dashboard,
      loader() {
        return Response.json(testData);
      },
    },
  ]);

  render(<RemixStub initialEntries={["/dashboard"]} />);

  it("renders a list of users with their album counts", async () => {
    for (const user of testData) {
      expect(await screen.findByText(user.name)).toBeInTheDocument();
      expect(
        await screen.findByText(`${user.albumCount} albums`)
      ).toBeInTheDocument();
      expect(await screen.findByText(user.email)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: user.name })).toHaveAttribute(
        "href",
        `/users/${user.id}`
      );
    }
  });
});
