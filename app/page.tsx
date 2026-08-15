import { Button } from "@/components/ui/button";
import Logout from "@/module/auth/components/logout";
import { requireAuth } from "@/module/auth/lib/auth-utils";

export default async function Home() {
  await requireAuth();

  return (
    <div>
      <Logout>
        <Button>Logout</Button>
      </Logout>
    </div>
  );
}
