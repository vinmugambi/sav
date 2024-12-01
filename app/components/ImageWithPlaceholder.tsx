import { useState } from "react";
import { Photo } from "~/types";

export default function ImageWithPlaceholder({ photo }: { photo: Photo }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={`w-full rounded-md overflow-hidden aspect-square ${
        isLoading ? "animate-pulse bg-gray-200" : ""
      }`}
    >
      <img
        src={photo.url}
        alt={photo.title}
        className={`w-full h-auto  ${isLoading ? "invisible" : "visible"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)} // Handle loading errors
      />
    </div>
  );
}
