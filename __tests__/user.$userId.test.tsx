import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest"; // Ensure Vitest is installed
import UserPage from "~/routes/users.$userId";
import type { Album, User } from "~/types";

describe("User Page", () => {
  const testData: {
    user: User;
    albums: Album[];
  } = {
    user: {
      name: "John",
      email: "john@gmail.com",
      id: 1,
      username: "john",
    },
    albums: [
      {
        id: 1,
        title: "Family",
        userId: 1,
      },
      {
        id: 2,
        title: "Friends",
        userId: 1,
      },
    ],
  };

  const RemixStub = createRemixStub([
    {
      path: "/user/1",
      Component: UserPage,
      loader() {
        return testData;
      },
    },
  ]);

  it("renders the user details", async () => {
    render(<RemixStub initialEntries={["/user/1"]} />);
    expect(await screen.findByText(testData.user.name)).toBeInTheDocument();
  });

  it("renders the list of albums", async () => {
    render(<RemixStub initialEntries={["/user/1"]} />);
    for (const album of testData.albums) {
      expect(await screen.findByText(album.title)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: album.title })).toHaveAttribute(
        "href",
        `/albums/${album.id}`
      );
    }
  });
});
