import { createRemixStub } from "@remix-run/testing";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AlbumPage from "~/routes/_app.albums.$albumId";
import type { Album, Photo } from "~/types";

describe("Album Page", () => {
  const testData: {
    album: Album;
    photos: Photo[];
  } = {
    album: {
      id: 1,
      title: "Vacation Memories",
      userId: 2,
    },
    photos: [
      {
        id: 1,
        title: "Beach Sunset",
        albumId: 1,
        url: "https://via.placeholder.com/150",
        thumbnailUrl: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        title: "Mountain Hike",
        albumId: 1,
        url: "https://via.placeholder.com/150",
        thumbnailUrl: "https://via.placeholder.com/150",
      },
    ],
  };

  const RemixStub = createRemixStub([
    {
      path: "/albums/1",
      Component: AlbumPage,
      loader() {
        return testData;
      },
    },
  ]);

  it("renders the album title and user link", async () => {
    render(<RemixStub initialEntries={["/albums/1"]} />);

    expect(await screen.findByText(testData.album.title)).toBeInTheDocument();

    const userLink = screen.getByTitle(/user/i);
    expect(userLink).toHaveAttribute("href", `/users/${testData.album.userId}`);
  });

  it("renders the list of photos", async () => {
    render(<RemixStub initialEntries={["/albums/1"]} />);

    for (const photo of testData.photos) {
      expect(await screen.findByText(photo.title)).toBeInTheDocument();
      const photoLink = screen.getByTitle(photo.title);
      expect(photoLink).toHaveAttribute("href", `/photos/${photo.id}`);
    }
  });
});
