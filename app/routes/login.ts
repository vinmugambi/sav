import { ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { createSessionAndRedirect } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const method = searchParams.get("method") as string;

  if (!["github", "password"].includes(method)) {
    throw new Response("Authentication provider not supported", {
      status: 422,
    });
  }

  const user = await authenticator.authenticate(method, request);

  // for password authentication - finish the authentication
  if (method === "password" && user) {
    return createSessionAndRedirect(user, request, "/home");
  }
}
