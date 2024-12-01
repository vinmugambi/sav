import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import BackButton from "~/components/BackButton";
import ImageWithPlaceholder from "~/components/ImageWithPlaceholder";
import { Spinner } from "~/components/Spinner";
import { getData } from "~/services/api.server";
import type { Photo } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const photoId = params.photoId;

  if (!photoId) {
    throw new Response("Photo ID not provided", { status: 400 });
  }

  const photo = await getData<Photo>(`/photos/${photoId}`);
  return photo;
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

  return (await response.json()) as { title: string };
};

export default function PhotoPage() {
  const photo = useLoaderData<Photo>();
  const [isEditing, setIsEditing] = useState(false);
  const fetcher = useFetcher<{ title: string }>({ key: "edit title" });

  useEffect(() => {
    if (fetcher.data) {
      setIsEditing(false);
    }
  }, [fetcher.data]);

  const title = fetcher.data?.title ?? photo.title;
  const isSubmitting = fetcher.state == "submitting";

  return (
    <div>
      <BackButton to={`/albums/${photo.albumId}`} ariaLabel="Back to Album" />
      <div className="pb-4">
        {!isEditing ? (
          <>
            <h1>{title}</h1>
            <button className="primary" onClick={() => setIsEditing(true)}>
              Edit Title
            </button>
          </>
        ) : (
          <fetcher.Form
            method="post"
            action={`/photos/${photo.id}`}
            className="flex flex-col"
          >
            <input
              name="title"
              type="text"
              defaultValue={title}
              className="border rounded-xl p-2 mb-4"
            />
            <div className="flex gap-2">
              <button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner /> Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="neutral"
              >
                Cancel
              </button>
            </div>
          </fetcher.Form>
        )}
      </div>

      <ImageWithPlaceholder photo={photo} />
    </div>
  );
}
