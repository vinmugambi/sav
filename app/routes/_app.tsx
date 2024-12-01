import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";
import LogoLink from "~/components/Logo";
import { PageLoadingIndicator } from "~/components/Spinner";
import { sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const email = session.get("email");
  if (!email) throw redirect("/");
  return email;
}

export default function AppLayout() {
  const email = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <main>
      <nav className="flex justify-between mb-6 wrap items-center">
        <LogoLink />
        <div className="flex items-center gap-4">
          <p>{email}</p>
          <Link to={"/logout"} className="button neutral">
            Logout
          </Link>
        </div>
      </nav>
      {isLoading ? <PageLoadingIndicator /> : <Outlet />}
    </main>
  );
}
