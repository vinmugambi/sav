import type { MetaFunction } from "@remix-run/node";
import banner from "../images/banner.webp";

export const meta: MetaFunction = () => {
  return [
    { title: "GramAlly" },
    { name: "description", content: "Welcome to GramAlly" },
  ];
};

export default function LandingPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <header className="flex flex-col items-center gap-8">
        <div className="text-3xl font-bold font-serif text-gray-800 dark:text-gray-100">
          GramAlly
        </div>
        <h1 className="text-5xl max-w-lg text-center">
          Share, discover and organize memories
        </h1>
        <img
          alt="banner - four people cuddling"
          className="rounded-3xl"
          src={banner}
        ></img>
      </header>
    </div>
  );
}
