import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getData } from "~/api";
import type { Album, User } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.userId;

  if (!userId) {
    throw new Response("User ID not provided", { status: 400 });
  }

  try {
    // Fetch the user and their albums in parallel
    const [user, albums] = await Promise.all([
      getData<User>(`/users/${userId}`),
      getData<Album[]>(`/albums?userId=${userId}`),
    ]);

    return { user, albums };
  } catch (error) {
    throw new Response("User not found", { status: 404 });
  }
};

export default function UserPage() {
  const { user, albums } = useLoaderData<{ user: User; albums: Album[] }>();

  return (
    <div>
      <div className="flex gap-4 mt-8">
        <div className="h-12 w-12 bg-gray-400 rounded-full"></div>

        <div>
          <Link to={`/users/${user.id}`} className="text-blue-500 underline">
            {user.name}
          </Link>
          <div className="flex gap-2">
            <div>{user.email}</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {albums.map((album) => (
            <li key={album.id} className="border rounded-xl p-4">
              <Link to={`/albums/${album.id}`}>
                <h3 className="font-semibold ">{album.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
