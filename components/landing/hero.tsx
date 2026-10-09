import Link from "next/link";

import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  FileCode2,
  GitPullRequest,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { HeroPrimaryCTA } from "@/components/landing/hero-primary-cta";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-5 pt-12 pb-20 sm:px-8 sm:pt-20 lg:pt-18 lg:pb-28">
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Blue Spotlight Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-190 md:inset-0 md:h-auto"
          style={{
            background: `
              radial-gradient(
                ellipse 48% 38% at 50% 50%,
                rgba(5, 143, 255, 0.28) 0%,
                rgba(5, 143, 255, 0.16) 34%,
                rgba(5, 143, 255, 0.05) 68%,
                transparent 100%
              ),
              radial-gradient(
                ellipse 68% 52% at 50% 60%,
                rgba(5, 143, 255, 0.11) 0%,
                rgba(5, 143, 255, 0.025) 64%,
                transparent 100%
              )
            `,
            filter: "blur(32px)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="border-primary/20 bg-primary/5 text-foreground mb-6 inline-flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-xs font-medium">
              <Sparkles aria-hidden="true" className="text-primary size-3.5" />
              AI code review for your GitHub pull requests
              <ArrowUpRight
                aria-hidden="true"
                className="text-primary size-3.5"
              />
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance lg:text-4xl">
              AI code reviews that understand the code around the change
            </h2>

            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-base leading-7 text-pretty sm:text-lg">
              CodeNook reviews pull requests with context from your entire
              repository — and explains what needs attention
            </p>

            <div className="mt-8 flex flex-row items-center justify-center gap-3">
              <HeroPrimaryCTA />

              <Button
                asChild
                variant="outline"
                className="border-primary/20 bg-primary/5 text-foreground dark:bg-primary/5 h-11 gap-2 rounded-full border-2 px-5 text-sm font-semibold shadow-md transition-all hover:shadow-lg"
              >
                <Link href="#product-preview">
                  See a sample review
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto mt-10 max-w-6xl">
            <div
              aria-hidden="true"
              className="from-brand/15 via-brand/10 to-brand-soft/20 absolute -inset-x-8 top-10 -z-10 h-3/4 rounded-[3rem] bg-linear-to-r blur-3xl"
            />

            <div
              className="bg-card overflow-hidden rounded-2xl border shadow-xl sm:rounded-3xl"
              id="product-preview"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm">
                    <GitPullRequest aria-hidden="true" className="size-4" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="truncate text-xs font-semibold">
                      Codenook pull request review
                    </p>
                    <p className="text-muted-foreground truncate font-mono text-[10px]">
                      acme / storefront · PR #128
                    </p>
                  </div>
                </div>
                <div className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium">
                  <span className="bg-success size-1.5 rounded-full" />
                  Review posted
                </div>
              </div>

              <div className="border-b px-4 py-3 text-left sm:px-6">
                <p className="text-sm font-semibold">
                  Add refresh token rotation
                </p>
                <p className="text-muted-foreground mt-1 text-[10px]">
                  3 files changed <span className="px-1">·</span>{" "}
                  <span className="text-success font-medium">+42</span>{" "}
                  <span className="text-destructive font-medium">−11</span>
                </p>
              </div>

              <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.88fr)]">
                <div className="p-5 sm:p-7">
                  <div className="text-muted-foreground flex items-center justify-between gap-3 text-[11px] font-medium">
                    <div className="flex items-center gap-2">
                      <Code2 aria-hidden="true" className="size-3.5" />
                      Changes reviewed
                    </div>
                    <span className="font-mono text-[9px]">
                      src/auth/refresh.ts
                    </span>
                  </div>

                  <div className="dark:bg-code-surface mt-4 overflow-hidden rounded-xl border text-left">
                    <div className="flex items-center gap-2 border-b px-3 py-2.5">
                      <FileCode2
                        aria-hidden="true"
                        className="text-brand-soft size-3.5"
                      />
                      <span className="font-mono text-[10px]">refresh.ts</span>
                      <span className="text-muted-foreground ml-auto text-[9px]">
                        TypeScript
                      </span>
                    </div>
                    <div className="overflow-x-auto px-3 py-3 font-mono text-[10px] leading-6 sm:text-[11px]">
                      <p className="text-muted-foreground whitespace-nowrap">
                        <span className="text-muted-foreground/50 mr-3">
                          18
                        </span>
                        <span className="text-violet-600 dark:text-violet-400">
                          async function
                        </span>{" "}
                        rotateRefreshToken(token) &#123;
                      </p>
                      <p className="bg-destructive/10 whitespace-nowrap">
                        <span className="text-destructive mr-3 pl-1">19</span>−
                        revokePreviousToken(token);
                      </p>
                      <p className="bg-success/10 whitespace-nowrap">
                        <span className="text-success mr-3 pl-1">20</span>+
                        return issueNewToken(userId);
                      </p>
                      <p className="text-muted-foreground whitespace-nowrap">
                        <span className="text-muted-foreground/50 mr-3">
                          21
                        </span>
                        &#125;
                      </p>
                    </div>
                  </div>

                  <div className="bg-secondary/80 mt-4 rounded-xl border p-3 text-left">
                    <p className="text-[10px] font-semibold">
                      Repository context considered
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[9px]">
                        <FileCode2 aria-hidden="true" className="size-3" />
                        auth/session.ts
                      </span>
                      <span className="bg-card text-muted-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[9px]">
                        <FileCode2 aria-hidden="true" className="size-3" />
                        auth/token-store.ts
                      </span>
                    </div>
                  </div>
                </div>

                <aside className="bg-muted/50 border-t p-5 text-left sm:p-7 md:border-t-0 md:border-l">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold">AI review summary</p>
                      <p className="text-muted-foreground mt-1 text-[10px]">
                        Based on the diff and related code
                      </p>
                    </div>
                    <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <Sparkles aria-hidden="true" className="size-4" />
                    </span>
                  </div>

                  <div className="bg-card mt-4 rounded-xl border p-4">
                    <p className="text-[10px] font-semibold">Summary</p>
                    <p className="text-muted-foreground mt-1.5 text-[10px] leading-5">
                      The refresh flow now rotates tokens. Check that previously
                      issued tokens cannot still create a valid session.
                    </p>
                  </div>

                  <div className="bg-card border-primary/25 mt-3 rounded-xl border p-4">
                    <div className="flex items-center gap-2">
                      <ShieldAlert
                        aria-hidden="true"
                        className="text-brand-soft size-3.5"
                      />
                      <p className="text-[10px] font-semibold">
                        Potential issue to investigate
                      </p>
                    </div>
                    <p className="text-muted-foreground mt-2 text-[10px] leading-5">
                      Confirm token revocation is persisted before the new token
                      is accepted.
                    </p>
                    <div className="text-muted-foreground mt-3 border-t pt-2.5 text-[9px]">
                      Suggested next step: verify the rotation path against the
                      existing session logic.
                    </div>
                  </div>

                  <div className="text-muted-foreground mt-4 flex items-center gap-2 text-[9px]">
                    <Check
                      aria-hidden="true"
                      className="text-success size-3.5"
                    />
                    Walkthrough, issues, and suggestions included
                  </div>
                </aside>
              </div>
            </div>

            <div className="bg-card text-muted-foreground pointer-events-none absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border px-3 py-2 text-[10px] shadow-sm sm:flex">
              <span className="bg-success size-1.5 rounded-full" />
              Review context from the whole repository
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
