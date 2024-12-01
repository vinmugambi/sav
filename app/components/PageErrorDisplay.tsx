import { useFetcher } from "@remix-run/react";
import LogoLink from "./Logo";
import { Spinner } from "./Spinner";

type PageErrorDisplayProps = {
  statusCode?: number;
  title?: string;
  body?: string;
};

export default function PageErrorDisplay({
  statusCode = 500,
  title = "Something went wrong",
  body,
}: PageErrorDisplayProps) {
  const isServerError = statusCode >= 500;
  body = body
    ? body
    : !body && isServerError
    ? `Our technicians have been notified of this error`
    : "";
  const fetcher = useFetcher();

  function reload() {
    fetcher.load(window.location.pathname);
  }

  return (
    <main>
      <LogoLink />

      <div className="mt-6 max-w-xl">
        <div className="text-sm uppercase">
          {statusCode} {isServerError ? "server" : "client"} error
        </div>
        <h1 className="leading-none">{title}</h1>
        <p className="my-4 text-lg">{body}</p>
        {isServerError && (
          <button
            onClick={reload}
            className="primary"
            disabled={fetcher.state === "loading"}
          >
            {fetcher.state === "loading" ? (
              <>
                <Spinner /> Retrying...
              </>
            ) : (
              "Try again"
            )}
          </button>
        )}
      </div>
    </main>
  );
}
