import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getData } from "~/api";
import type { Photo } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const photoId = params.photoId;

  if (!photoId) {
    throw new Response("Photo ID not provided", { status: 400 });
  }

  try {
    const photo = await getData<Photo>(`/photos/${photoId}`);
    return photo;
  } catch (error) {
    throw new Response("Photo not found", { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const photoId = params.photoId;

  if (!photoId) {
    throw new Response("Photo ID not provided", { status: 400 });
  }

  const formData = await request.formData();
  const updatedTitle = formData.get("title");

  if (typeof updatedTitle !== "string" || !updatedTitle.trim()) {
    throw new Response("Invalid title", { status: 400 });
  }

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/photos/${photoId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: updatedTitle }),
    }
  );

  if (!response.ok) {
    throw new Response("Failed to update photo title", { status: 500 });
  }

  return await response.json();
};

export default function PhotoPage() {
  const photo = useLoaderData<Photo>();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(photo.title);

  const handleEdit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(form);
    const updatedTitle = formData.get("title");

    if (typeof updatedTitle === "string") {
      const response = await fetch(`/photos/${photo.id}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsEditing(false);
        const updatedPhoto = await response.json();
        setTitle(updatedPhoto.title);
      } else {
        alert("Failed to update the title");
      }
    }
  };

  return (
    <main>
      <Link to={`/albums/${photo.albumId}`}>
        <h3 className="text-blue-500 hover:underline">Back to Album</h3>
      </Link>

      <div className="py-4">
        {!isEditing ? (
          <>
            <h1 className="text-2xl font-bold">{title}</h1>
            <button className="primary" onClick={() => setIsEditing(true)}>
              Edit Title
            </button>
          </>
        ) : (
          <form onSubmit={handleEdit} className="flex flex-col">
            <input
              name="title"
              type="text"
              defaultValue={title}
              className="border rounded-xl p-2 mb-4"
            />
            <div className="flex gap-2">
              <button type="submit" className="primary">
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="neutral"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-auto rounded-md mb-4"
      />
    </main>
  );
}
