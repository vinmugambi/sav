import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("email");
  if (!user) throw redirect("/login");
  return null;
}

export function AppLayout() {
  return <nav></nav>;
}
