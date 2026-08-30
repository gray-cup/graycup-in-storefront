import { auth } from "./auth";

type WithRole = { id: string; email: string; role?: string | null };

// Returns the signed-in user iff their better-auth `role` is "admin", else null.
// Use at the top of any admin-only API route:
//   const admin = await getAdminUser(request);
//   if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });
export async function getAdminUser(request: Request): Promise<WithRole | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  const user = session?.user as WithRole | undefined;
  return user?.role === "admin" ? user : null;
}
