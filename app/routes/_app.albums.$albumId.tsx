import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import BackButton from "~/components/BackButton";
import ImageWithPlaceholder from "~/components/ImageWithPlaceholder";
import { getData } from "~/services/api.server";
import type { Album, Photo } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const albumId = params.albumId;

  if (!albumId) {
    throw new Response("Album ID not provided", { status: 400 });
  }

  const [album, photos] = await Promise.all([
    getData<Album>(`/albums/${albumId}`),
    getData<Photo[]>(`/photos?albumId=${albumId}`),
  ]);

  return { album, photos };
};

export default function AlbumPage() {
  const { album, photos } = useLoaderData<{ album: Album; photos: Photo[] }>();

  return (
    <div>
      <div className="mb-4 flex items-start gap-2">
        <BackButton ariaLabel="Back to user" to={`/users/${album.userId}`} />
        <h1 className="text-4xl font-serif font-bold">{album.title}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Link title={photo.title} to={`/photos/${photo.id}`} key={photo.id}>
            <ImageWithPlaceholder photo={photo} />
            <h3 className="mt-2">{photo.title}</h3>
            <span className="text-blue-500 hover:underline text-sm">View</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
