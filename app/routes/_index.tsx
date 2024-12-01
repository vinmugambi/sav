import type { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import {
  createSessionAndRedirect,
  sessionStorage,
} from "~/services/session.server";

import LoginForm from "~/components/LoginForm";
import LogoLink from "~/components/Logo";
import banner from "../images/banner.webp";

export const meta: MetaFunction = () => {
  return [
    { title: "GramAlly" },
    { name: "description", content: "Welcome to GramAlly" },
  ];
};

export default function LandingPage() {
  return (
    <main>
      <header className="flex items-center flex-col gap-8">
        <LogoLink />

        <h1 className="-mb-2 px-8 text-5xl text-center">
          Share, discover and organize memories
        </h1>

        <LoginForm />

        <img
          alt="banner - four people cuddling"
          className="rounded-3xl mt-4"
          src={banner}
        />
      </header>
    </main>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const oauth = searchParams.get("oauth");
  const code = searchParams.get("code");

  const cookie = request.headers.get("cookie");
  if (cookie && code) {
    const withCode = `${cookie}&codeVerifier=${code}`;
    request.headers.set("cookie", withCode);
  }

  if (oauth === "github") {
    const user = await authenticator.authenticate("github", request);
    return createSessionAndRedirect(user, request, "/home");
  } else {
    const session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );
    const user = session.get("email");
    if (user) return redirect("/home");
    return null;
  }
}
