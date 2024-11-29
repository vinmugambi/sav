import type { MetaFunction } from "@remix-run/node";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import {
  createSessionAndRedirect,
  sessionStorage,
} from "~/services/session.server";

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
      <header className="flex flex-col gap-8">
        <div className="text-2xl text-center font-bold font-serif text-gray-800">
          GramAlly
        </div>

        <h1 className=" bottom-0 px-8 text-5xl text-center">
          Share, discover and organize memories
        </h1>

        <div className="flex -mt-4 mb-4 justify-center gap-4 wrap">
          <Form method="post" action=".?method=password">
            <input
              type="hidden"
              autoComplete="email"
              name="email"
              value="test@gmail.com"
              required
            />
            <input
              value={"password"}
              type="hidden"
              name="password"
              autoComplete="current-password"
              required
            />
            <button className="neutral">Sign into test account</button>
          </Form>

          <Form method="post" action=".?method=github">
            {" "}
            <input type="hidden" name="strategy" value="github" />
            <button className="primary">Sign in with Github</button>
          </Form>
        </div>
        <img
          alt="banner - four people cuddling"
          className="rounded-3xl"
          src={banner}
        ></img>
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
