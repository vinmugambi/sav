import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import type { Album, User, UserWithAlbumCount } from "app/types";
import Avatar from "~/components/Avatar";
import { getData } from "~/services/api.server";

// fetch user on the server side
export const loader: LoaderFunction = async () => {
  const [users, albums] = await Promise.all([
    getData<User[]>("/users"),
    getData<Album[]>("/albums"),
  ]);

  // Map album counts to each user
  const usersWithAlbumCount: UserWithAlbumCount[] = users.map((user) => ({
    ...user,
    albumCount: albums.filter((album) => album.userId === user.id).length,
  }));

  return usersWithAlbumCount;
};

// render page with fetched data
export default function HomePage() {
  const users = useLoaderData<(User & { albumCount: number })[]>();

  return (
    <div>
      <h1>People</h1>
      <ul className="flex flex-col">
        {users.map((user) => (
          <li key={user.id} className="py-2">
            <div className="flex gap-4">
              <Avatar name={user.name} />
              <div>
                <Link
                  to={`/users/${user.id}`}
                  className="text-blue-500 underline"
                >
                  {user.name}
                </Link>
                <div className="flex gap-2">
                  <div className="lowercase italic"> {user.email}</div>
                  <div>{user.albumCount} albums</div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
