import { createCookieSessionStorage, redirect } from "@remix-run/node";

export type Authed = {
  email: string;
  accessToken?: string;
  refreshToken?: string | null;
  name?: string;
};

type SessionFlashData = {
  error: string;
};

const secrets = (process.env.COOKIE_SECRETS ?? "n3v3r,Mind").split(",");

export const sessionStorage = createCookieSessionStorage<
  Authed,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 86_400, // one day
    path: "/",
    sameSite: "lax",
    secrets,
    secure: true,
  },
});

export async function createSessionAndRedirect(
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
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
