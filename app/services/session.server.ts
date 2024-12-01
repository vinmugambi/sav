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

export const sessionStorage = createCookieSessionStorage<
  Authed,
  SessionFlashData
>({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: ["n3v3r Mind"],
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
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
