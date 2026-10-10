import {
  ArrowUpRight,
  Check,
  CircleDot,
  FileCode2,
  GitBranch,
  GitPullRequest,
  LockKeyhole,
  SearchCode,
  Sparkles,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect a repository",
    description:
      "Choose a GitHub repo. CodeNook installs a pull request webhook and indexes its files.",
    preview: RepositoryPreview,
  },
  {
    number: "02",
    title: "Open a pull request",
    description:
      "Each new or updated PR is checked against the diff and relevant code from the repo.",
    preview: DiffPreview,
  },
  {
    number: "03",
    title: "Review it on GitHub",
    description:
      "Get a walkthrough, summary, strengths, issues, and suggestions in the pull request.",
    preview: ReviewPreview,
  },
];

function RepositoryPreview() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#080d13]/95 text-left shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-1.5">
        <div className="flex items-center gap-2 text-[11px] font-medium text-white/80">
          <GitBranch className="size-4 text-white" />
          GitHub connection
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2 py-1 text-[9px] font-medium text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Connected
        </span>
      </div>

      <div className="px-4 pt-2 pb-1">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-[10px] font-medium text-white/50">
            SELECT A REPOSITORY
          </p>
          <span className="text-[9px] text-white/35">Sample workspace</span>
        </div>

        <div className="space-y-1">
          <div className="border-brand-blue/35 bg-brand-blue/10 flex items-center gap-2.5 rounded-lg border px-2.5 py-1">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/8 text-white/90">
              <FileCode2 className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-semibold text-white">
                acme / storefront
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[9px] text-white/45">
                <GitBranch className="size-2.5" /> main
                <span className="px-0.5 text-white/20">·</span>
                <LockKeyhole className="size-2.5" /> Private
              </p>
            </div>
            <span className="bg-brand-blue flex size-5 items-center justify-center rounded-full text-white">
              <Check className="size-3" />
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 opacity-55">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/70">
              <FileCode2 className="size-3.5" />
            </span>
            <span className="text-[10px] text-white/70">acme / ui-kit</span>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-1 mb-4 rounded-lg border border-white/8 bg-white/[0.025] p-2">
        <div className="mb-2 flex items-center justify-between text-[9px]">
          <span className="flex items-center gap-1.5 text-white/75">
            <GitPullRequest className="text-brand-blue size-3" />
            Pull request reviews
          </span>
          <span className="text-emerald-300/80">Ready</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-white/45">
          <span className="relative flex size-3 items-center justify-center">
            <span className="bg-brand-blue/30 absolute size-3 animate-ping rounded-full" />
            <CircleDot className="text-brand-blue relative size-2.5" />
          </span>
          Repository indexing starts when connected
          <ArrowUpRight className="ml-auto size-3 text-white/30" />
        </div>
      </div>
    </div>
  );
}

function DiffPreview() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#080d13]/95 text-left shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2.5">
        <GitPullRequest className="text-brand-blue size-3.5" />
        <span className="text-[10px] font-medium text-white/85">PR #128</span>
        <span className="text-[9px] text-white/35">›</span>
        <span className="truncate font-mono text-[9px] text-white/55">
          feat/cart-quantity
        </span>
        <span className="ml-auto shrink-0 rounded-full border border-emerald-400/15 bg-emerald-400/8 px-1.5 py-0.5 text-[8px] text-emerald-300/90">
          Open
        </span>
      </div>
      <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2 text-[9px]">
        <FileCode2 className="size-3 text-white/45" />
        <span className="font-mono text-white/75">src/cart/total.ts</span>
        <span className="ml-auto font-mono text-white/35">
          <span className="text-emerald-300">+2</span>{" "}
          <span className="text-rose-300">−1</span>
        </span>
      </div>
      <div className="overflow-hidden py-2 font-mono text-[9px] leading-[1.85] sm:text-[10px]">
        <p className="truncate px-3 text-white/45">
          <span className="mr-3 text-white/25">41</span>export function
          calculateTotal(items) &#123;
        </p>
        <p className="truncate border-y border-rose-400/8 bg-rose-400/[0.07] px-3 text-rose-100/80">
          <span className="mr-3 text-white/25">42</span>− return
          items.reduce((sum, item) =&gt; sum + item.price, 0);
        </p>
        <p className="border-brand-blue/15 bg-brand-blue/10 truncate border-y px-3 text-white/85">
          <span className="text-brand-blue/70 mr-3">42</span>+ return
          items.reduce((sum, item) =&gt; sum + item.price * item.quantity, 0);
        </p>
        <p className="truncate px-3 text-white/45">
          <span className="mr-3 text-white/25">43</span>&#125;
        </p>
      </div>
      <div className="border-t border-white/8 bg-white/[0.02] px-3 py-2.5">
        <p className="mb-2 flex items-center gap-1.5 text-[9px] font-medium text-white/65">
          <SearchCode className="text-brand-blue size-3" /> Related code
          considered
        </p>
        <div className="flex flex-wrap gap-1">
          <span className="rounded border border-white/8 bg-white/[0.035] px-1.5 py-1 font-mono text-[8px] text-white/55">
            src/cart/pricing.ts
          </span>
          <span className="rounded border border-white/8 bg-white/[0.035] px-1.5 py-1 font-mono text-[8px] text-white/55">
            src/types/cart.ts
          </span>
        </div>
      </div>
    </div>
  );
}

function ReviewPreview() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#080d13]/95 text-left shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]"
    >
      <div className="flex items-center gap-2.5 border-b border-white/8 px-3 py-2.5">
        <span className="bg-brand-blue flex size-7 items-center justify-center rounded-lg text-white shadow-[0_4px_14px_-5px_var(--brand-blue)]">
          <Sparkles className="size-3.5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-white/90">
            CodeNook review
          </p>
          <p className="mt-0.5 truncate font-mono text-[8px] text-white/40">
            src/cart/total.ts · line 42
          </p>
        </div>
        <span className="border-brand-blue/20 bg-brand-blue/8 text-brand-blue flex items-center gap-1 rounded-full border px-1.5 py-1 text-[8px]">
          <Check className="size-2.5" /> Review
        </span>
      </div>
      <div className="space-y-2.5 p-3">
        <div className="rounded-lg border border-white/8 bg-white/[0.025] p-2.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="bg-brand-blue size-1.5 rounded-full" />
            <p className="text-[9px] font-semibold text-white/85">
              Review summary
            </p>
            <span className="ml-auto text-[8px] text-white/35">
              Walkthrough
            </span>
          </div>
          <p className="text-[9px] leading-[1.65] text-white/55">
            The total now accounts for each item’s quantity in the cart.
          </p>
        </div>
        <div className="rounded-lg border border-amber-300/15 bg-amber-300/[0.045] p-2.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="flex size-4 items-center justify-center rounded bg-amber-300/10 text-[8px] font-bold text-amber-200">
              !
            </span>
            <p className="text-[9px] font-semibold text-amber-100/90">
              Potential issue
            </p>
            <span className="ml-auto rounded border border-amber-200/10 px-1 py-0.5 text-[7px] text-amber-100/50">
              Check
            </span>
          </div>
          <p className="text-[9px] leading-[1.65] text-white/55">
            Confirm this matches the existing pricing and discount logic.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-white/8 px-3 py-2 text-[8px] text-white/40">
        <span className="bg-brand-blue size-1 rounded-full" />
        Posted as a pull request review
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="px-5 py-12 sm:px-8 sm:py-12 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="border-brand-blue/20 bg-brand-blue/5 text-foreground mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium">
            <Sparkles aria-hidden="true" className="text-brand-blue size-3.5" />
            How it works
          </div>

          <h2
            id="how-it-works-title"
            className="text-2xl font-semibold tracking-[-0.03em] text-balance lg:text-3xl"
          >
            From your repository to a better-informed review
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
            Connect a repo once. Each pull request gets reviewed with the code
            around the change in mind.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Preview = step.preview;

            return (
              <li
                key={step.number}
                className="group bg-background border-brand-blue/20 relative flex min-h-107.5 flex-col overflow-hidden rounded-lg border"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[76%]"
                  style={{
                    background:
                      "radial-gradient(ellipse 105% 85% at 50% 0%, color-mix(in srgb, var(--brand-blue) 30%, transparent), transparent 73%)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="to-background pointer-events-none absolute inset-x-0 top-[44%] bottom-34 z-10 bg-linear-to-b from-transparent"
                />

                <div className="relative z-0 flex min-h-63.75 flex-1 items-center justify-center px-4 pt-2 sm:min-h-68.75 sm:px-5">
                  <Preview />
                </div>

                <div className="relative z-20 mt-auto px-5 pt-2 pb-6 sm:px-6 sm:pb-7">
                  <div className="text-brand-blue mb-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.12em]">
                    STEP {step.number}
                  </div>
                  <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6 font-medium">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
