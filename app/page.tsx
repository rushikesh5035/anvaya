import { redirect } from "next/navigation";

import { requireAuth } from "@/module/auth/lib/auth-utils";

export default async function Home() {
  await requireAuth();

  return redirect("/dashboard");
}
