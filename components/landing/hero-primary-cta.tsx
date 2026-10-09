"use client";

import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function HeroPrimaryCTA() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session);

  return (
    <Button
      asChild
      className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/25 h-11 rounded-full px-5 text-sm font-semibold shadow-md transition-all hover:shadow-lg"
    >
      <Link href={isAuthenticated ? "/dashboard" : "/login"}>
        Connect GitHub
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </Button>
  );
}
