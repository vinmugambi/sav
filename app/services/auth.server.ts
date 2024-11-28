import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GitHubStrategy } from "remix-auth-github";
import { Authed } from "./session.server";

const authenticator = new Authenticator<Authed>();

const appHost = process.env.APP_HOST ?? "http:localhost:5173";
const redirectURI = appHost.replace(/\/^/, "") + "/oauth";

authenticator.use(
  new GitHubStrategy(
    {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? "",
      redirectURI: redirectURI,
      scopes: ["user:email"],
    },
    async ({ tokens }) => {
      return {
        userId: "1",
        accessToken: tokens.accessToken(),
        refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null,
      };
    }
  ),
  "github"
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (email == "test@gmail.com" && password == "password") {
      return {
        userId: "1",
        email,
      };
    }
    throw new Error("user not found");
  }),
  "password"
);

export { authenticator };
