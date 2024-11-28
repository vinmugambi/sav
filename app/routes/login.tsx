import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { Authed, sessionStorage } from "~/services/session.server";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-2">
      <Form action="?method=password" method="post">
        <input type="email" name="email" required />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <button>Sign in</button>
      </Form>

      <Form action="?method=github" method="post">
        <input type="hidden" name="strategy" value="github" />
        <button>Sign in with Github</button>
      </Form>
    </div>
  );
}

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

async function createSessionAndRedirect(
  user: Authed,
  request: Request,
  redirectPath: string
) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  if (user.email) session.set("email", user.email);
  if (user.accessToken) session.set("accessToken", user.accessToken);

  throw redirect(redirectPath, {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
