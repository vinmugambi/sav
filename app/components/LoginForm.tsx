import { useFetcher } from "@remix-run/react";
import { Spinner } from "./Spinner";

export default function LoginForm() {
  const loginWithPassword = useFetcher({ key: "loginWithPassword" });
  const loginWithGithub = useFetcher({ key: "loginWithGithub" });

  const isSubmittingPassword = loginWithPassword.state == "submitting";
  const isSubmittingGithub = loginWithGithub.state == "submitting";

  const isSubmitting = isSubmittingGithub || isSubmittingPassword;

  return (
    <div className="flex justify-center gap-4 wrap">
      <loginWithPassword.Form method="post" action="/login?method=password">
        <input
          type="hidden"
          autoComplete="email"
          name="email"
          value="test@gmail.com"
          required
        />
        <input
          value="password"
          type="hidden"
          name="password"
          autoComplete="current-password"
          required
        />
        <button disabled={isSubmitting} className="neutral">
          {isSubmittingPassword ? (
            <>
              <Spinner /> Signing you in...
            </>
          ) : (
            "Sign into test account"
          )}
        </button>
      </loginWithPassword.Form>

      <loginWithGithub.Form method="post" action="/login?method=github">
        <button disabled={isSubmitting} className="primary">
          {isSubmittingGithub ? (
            <>
              <Spinner /> Contacting GitHub...
            </>
          ) : (
            "Sign in with GitHub"
          )}
        </button>
      </loginWithGithub.Form>
    </div>
  );
}
