import type { ActionFunctionArgs } from "@remix-run/node";
import { createRemixStub } from "@remix-run/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PhotoPage from "~/routes/_app.photos.$photoId";
import type { Photo } from "~/types";

describe("Photo Page", () => {
  const testData: Photo = {
    id: 1,
    albumId: 2,
    title: "Sunset View",
    url: "https://via.placeholder.com/600",
    thumbnailUrl: "https://via.placeholder.com/150",
  };

  const RemixStub = createRemixStub([
    {
      path: "/photos/1",
      Component: PhotoPage,
      loader() {
        return testData; // Simulate loader response
      },
      async action({ request }: ActionFunctionArgs) {
        const body = await request.formData();
        const title = body.get("title");
        if (!title) {
          return new Response("Title is required", { status: 422 });
        }
        return {
          ...testData,
          title,
        };
      },
    },
  ]);

  it("renders the photo details", async () => {
    render(<RemixStub initialEntries={["/photos/1"]} />);

    // Check photo title
    expect(await screen.findByText(testData.title)).toBeInTheDocument();

    // Check "Back to Album" link
    const backToAlbumLink = screen.getByRole("link", {
      name: /album/i,
    });
    expect(backToAlbumLink).toHaveAttribute(
      "href",
      `/albums/${testData.albumId}`
    );

    // Check photo image
    const photoImage = screen.getByRole("img", { name: testData.title });
    expect(photoImage).toHaveAttribute("src", testData.url);
  });

  it("allows editing the photo title", async () => {
    render(<RemixStub initialEntries={["/photos/1"]} />);

    // Check initial title display
    expect(await screen.findByText(testData.title)).toBeInTheDocument();

    // Locate the "Edit Title" button
    const editButton = screen.getByRole("button", { name: /edit title/i });
    expect(editButton).toBeInTheDocument();

    // Click the "Edit Title" button
    fireEvent.click(editButton);

    // Ensure input field is visible for editing
    const input = await screen.findByRole("textbox");
    expect(input).toHaveValue(testData.title);

    // Update the title in the input field
    fireEvent.change(input, { target: { value: "Updated Title" } });

    // Locate and click the "Save" button
    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    // Wait for the updated title to appear in the DOM
    await waitFor(() =>
      expect(screen.getByText(/Updated Title/)).toBeInTheDocument()
    );
  });

  it("allows editing the photo title", async () => {
    render(<RemixStub initialEntries={["/photos/1"]} />);

    // Check initial title display
    expect(await screen.findByText(testData.title)).toBeInTheDocument();

    // Locate the "Edit Title" button and click it
    const editButton = screen.getByRole("button", { name: /edit title/i });
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);

    // find cancel button and click it
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(await screen.findByText(testData.title)).toBeInTheDocument();
  });
});
