import { cookies } from "next/headers";

export interface StaffSession {
  staffId: string;
  name: string;
  role: "admin" | "manager" | "cashier" | "kitchen";
  restaurantId: string;
}

export async function setStaffSession(session: StaffSession) {
  const cookieStore = await cookies();
  const payload = Buffer.from(JSON.stringify(session)).toString("base64");
  
  cookieStore.set("pos_session", payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 43200, // 12 hours
  });
}

export async function getStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("pos_session");
  
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  
  try {
    const payload = Buffer.from(sessionCookie.value, "base64").toString("utf-8");
    return JSON.parse(payload) as StaffSession;
  } catch {
    return null;
  }
}

export async function clearStaffSession() {
  const cookieStore = await cookies();
  cookieStore.delete("pos_session");
}
