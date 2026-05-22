import { cookies } from "next/headers";

const COOKIE = "sf_business";

export async function getSessionBusinessId(): Promise<string | null> {
  const c = await cookies();
  return c.get(COOKIE)?.value ?? null;
}

export async function setSessionBusinessId(businessId: string): Promise<void> {
  const c = await cookies();
  c.set(COOKIE, businessId, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE);
}
