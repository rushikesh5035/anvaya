"use client";

import React from "react";

import Link from "next/link";

import { ArrowUpRight, LayoutDashboard, MenuIcon, XIcon } from "lucide-react";

import { Portal, PortalBackdrop } from "@/components/common/portal";
import { navLinks } from "@/components/landing/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <div className="flex gap-2 md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
        size="icon"
        variant="outline"
        className="border-none hover:cursor-pointer"
      >
        {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </Button>

      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop onClick={closeMenu} />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 data-[slot=open]:animate-in ease-out",
              "bg-background/95 size-full p-5 backdrop-blur-xl"
            )}
            data-slot="open"
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-auto grid max-w-lg gap-1"
            >
              {navLinks.map((link) => (
                <Button
                  asChild
                  className="h-8 justify-start text-sm"
                  key={link.label}
                  onClick={closeMenu}
                  variant="ghost"
                >
                  <a href={link.href}>{link.label}</a>
                </Button>
              ))}
              <div className="border-border/70 mt-2 grid gap-3 border-t pt-2">
                {isAuthenticated ? (
                  <Button
                    asChild
                    className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/25 h-10 rounded-full px-5 text-sm font-semibold shadow-md transition-all hover:shadow-lg"
                    onClick={closeMenu}
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard aria-hidden="true" className="size-4" />
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild className="w-full" variant="outline">
                      <Link href="/login" onClick={closeMenu}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild className="w-full" onClick={closeMenu}>
                      <Link href="/login">
                        Get Started
                        <ArrowUpRight aria-hidden="true" className="size-4" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </Portal>
      )}
    </div>
  );
}
