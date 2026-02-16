"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Sign out the current user using the server Supabase client.
 * This clears the session cookies so the next request (and middleware) see no user.
 * Required for logout to work on production where client-side signOut may not clear cookies.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
