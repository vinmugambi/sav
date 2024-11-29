import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getData } from "~/api";
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
      <div className="mb-4">
        <h1 className="text-4xl font-serif mb-2 font-bold">{album.title}</h1>
        <Link
          className="text-blue-500 hover:underline text-sm"
          to={`/users/${album.userId}`}
        >
          Back to user
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Photos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <Link title={photo.title} to={`/photos/${photo.id}`} key={photo.id}>
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-full h-auto rounded-md mb-2"
              />
              <h3 className="">{photo.title}</h3>
              <span className="text-blue-500 hover:underline text-sm">
                Expand
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
