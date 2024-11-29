import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import { authenticator } from "./services/auth.server";
import { createSessionAndRedirect } from "./services/session.server";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function action({ request }: ActionFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const method = searchParams.get("method") as string;

  if (!["github", "password"].includes(method)) {
    throw new Response("Authentication provider not supported", {
      status: 422,
    });
  }

  const user = await authenticator.authenticate(method, request);

  // for password auth - finish the authentication
  if (method === "password" && user) {
    return createSessionAndRedirect(user, request, "/home");
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <main>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </main>
    );
  } else {
    return (
      <main>
        <h1>Unknown Error</h1>
      </main>
    );
  }
}
