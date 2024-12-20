import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Avatar from "~/components/Avatar";
import BackButton from "~/components/BackButton";
import { getData } from "~/services/api.server";
import type { Album, User } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.userId;

  if (!userId) {
    throw new Response("User ID not provided", { status: 400 });
  }

  // Fetch the user and their albums in parallel
  const [user, albums] = await Promise.all([
    getData<User>(`/users/${userId}`),
    getData<Album[]>(`/albums?userId=${userId}`),
  ]);

  return { user, albums };
};

export default function UserPage() {
  const { user, albums } = useLoaderData<{ user: User; albums: Album[] }>();

  return (
    <div>
      <BackButton to={"/home"} ariaLabel="Back to user list" />
      <div className="flex gap-4 mt-4">
        <Avatar name={user.name} />
        <div>
          <Link to={`/users/${user.id}`} className="text-blue-500 underline">
            {user.name}
          </Link>
          <div className="flex gap-2">
            <div className="lowercase italic">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {albums?.map((album) => (
            <li
              key={album.id}
              className="border dark:border-gray-800 rounded-xl p-4"
            >
              <Link to={`/albums/${album.id}`}>
                <h3 className="font-medium">{album.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
