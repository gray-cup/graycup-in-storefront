import { Outlet, redirect } from "react-router";
import { auth } from "@/lib/auth";
import type { Route } from "./+types/layout";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    throw redirect("/auth/login?redirect=/account");
  }

  return null;
}

export default function AccountLayout() {
  return <Outlet />;
}
