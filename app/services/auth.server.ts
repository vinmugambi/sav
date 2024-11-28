import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GitHubStrategy } from "remix-auth-github";
import { Authed } from "./session.server";

const authenticator = new Authenticator<Authed>();

const appHost = process.env.APP_HOST ?? "http:localhost:5173";
const redirectURI = appHost.replace(/\/^/, "") + "/login?oauth=github";

authenticator.use(
  new GitHubStrategy(
    {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET ?? "",
      redirectURI: redirectURI,
      scopes: ["user:email"],
      cookie: "github",
    },
    async ({ tokens }) => {
      const emails: { email: string }[] = await getGithubEmail(tokens);
      console.log("github auth tokens", tokens, emails);

      return {
        email: emails[0].email,
        accessToken: tokens.accessToken(),
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
        email,
      };
    }
    throw new Response("User not found", { status: 401 });
  }),
  "password"
);

async function getGithubEmail(tokens: { accessToken: () => string }) {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${tokens.accessToken()}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return await response.json();
}

export { authenticator };
