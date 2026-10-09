"use client";

import Link from "next/link";

import { ArrowUpRight, LayoutDashboard } from "lucide-react";

import { Logo } from "@/components/common/logo";
import { MobileNav } from "@/components/common/mobile-nav";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function Header() {
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session);

  return (
    <header className="border-border/70 bg-background supports-backdrop-filter:bg-background/75 sticky top-0 z-50 border-b backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="xl mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <div className="flex flex-1 items-center">
          <Link aria-label="codenook home" href="/">
            <Logo className="text-foreground h-8 w-auto" />
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center gap-7 md:flex lg:gap-6">
          {navLinks.map((link) => (
            <Link
              className="text-foreground/75 hover:text-foreground text-sm font-medium transition-colors"
              href={link.href}
              key={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
          <Button
            asChild
            className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/25 h-10 rounded-full px-5 text-sm font-semibold shadow-md transition-all hover:shadow-lg"
          >
            <Link href={isAuthenticated ? "/dashboard" : "/login"}>
              {isAuthenticated ? (
                <>
                  <LayoutDashboard aria-hidden="true" className="size-4" />
                  Dashboard
                </>
              ) : (
                <>
                  Get Started
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </>
              )}
            </Link>
          </Button>
        </div>

        <MobileNav isAuthenticated={isAuthenticated} />
      </nav>
    </header>
  );
}
