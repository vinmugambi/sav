import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { sessionStorage } from "~/services/session.server";

export default function LoginPage() {
  return (
    <Form method="post">
      <input type="email" name="email" required />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.authenticate("password", request);

  console.log("user", user);

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  session.set("userId", user.userId);
  session.set("email", user.email);

  throw redirect("/home", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

// check if the user is already authenticated and redirect them to the home
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const userId = session.get("userId");
  if (userId) throw redirect("/home");
  return null;
}
