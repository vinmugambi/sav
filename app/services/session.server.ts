import { createCookieSessionStorage } from "@remix-run/node";

export type Authed = {
  userId: string;
  accessToken?: string;
  refreshToken?: string | null;
  name?: string;
  email?: string;
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

    // all of these are optional
    // domain: "remix.run",
    // Expires can also be set (although maxAge overrides it when used in combination).
    // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
    //
    expires: new Date(Date.now() + 60_000),
    httpOnly: true,
    maxAge: 60,
    path: "/",
    sameSite: "lax",
    secrets: ["n3v3r Mind"],
    secure: true,
  },
});
