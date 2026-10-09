import {
  Check,
  Circle,
  FileCode2,
  GitBranch,
  GitPullRequest,
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
      className="bg-background/75 border-border/70 mx-auto max-w-md rounded-lg border p-4 text-left shadow-lg shadow-black/20"
    >
      <div className="text-muted-foreground flex items-center gap-2 border-b pb-3 text-xs font-medium">
        <GitPullRequest className="text-brand-blue size-4" />
        GitHub repository
      </div>
      <div className="flex items-center gap-3 py-4">
        <span className="bg-brand-blue/10 text-brand-blue flex size-9 shrink-0 items-center justify-center rounded-lg">
          <GitBranch className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">acme / storefront</p>
          <p className="text-muted-foreground mt-0.5 text-[11px]">main</p>
        </div>
        <span className="bg-brand-blue/10 text-brand-blue rounded-full px-2 py-1 text-[10px] font-medium">
          Connected
        </span>
      </div>
      <div className="text-muted-foreground space-y-2 border-t pt-3 text-[11px]">
        <p className="flex items-center gap-2">
          <Check className="text-brand-blue size-3.5" /> Webhook installed
        </p>
        <p className="flex items-center gap-2">
          <Circle className="text-brand-blue size-3.5" /> Repository indexing
          starts
        </p>
      </div>
    </div>
  );
}

function DiffPreview() {
  return (
    <div
      aria-hidden="true"
      className="bg-background/75 border-border/70 mx-auto max-w-sm overflow-hidden rounded-lg border text-left shadow-lg shadow-black/20"
    >
      <div className="text-muted-foreground flex items-center gap-2 border-b px-3 py-2.5 text-[10px]">
        <FileCode2 className="size-3.5" />
        <span className="font-mono">src/cart/total.ts</span>
        <span className="ml-auto font-mono">
          <span className="text-brand-blue">+2</span> / −1
        </span>
      </div>
      <div className="overflow-hidden px-3 py-3 font-mono text-[10px] leading-[1.85]">
        <p className="text-muted-foreground truncate">
          <span className="mr-3 opacity-50">41</span>export function
          calculateTotal(items) &#123;
        </p>
        <p className="bg-destructive/10 -mx-3 truncate px-3">
          <span className="text-muted-foreground mr-3 opacity-50">42</span>−
          return items.reduce((sum, item) =&gt; sum + item.price, 0);
        </p>
        <p className="bg-brand-blue/10 -mx-3 truncate px-3">
          <span className="text-brand-blue mr-3 opacity-90">42</span>+ return
          items.reduce((sum, item) =&gt; sum + item.price * item.quantity, 0);
        </p>
        <p className="text-muted-foreground truncate">
          <span className="mr-3 opacity-50">43</span>&#125;
        </p>
      </div>
      <div className="border-t px-3 py-3">
        <p className="text-muted-foreground mb-2 flex items-center gap-1.5 text-[10px]">
          <SearchCode className="text-brand-blue size-3.5" /> Related repository
          context
        </p>
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-muted/80 rounded-md px-2 py-1 font-mono text-[9px]">
            src/cart/pricing.ts
          </span>
          <span className="bg-muted/80 rounded-md px-2 py-1 font-mono text-[9px]">
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
      className="bg-background/75 border-border/70 mx-auto max-w-sm overflow-hidden rounded-lg border text-left shadow-lg shadow-black/20"
    >
      <div className="flex items-center gap-2 border-b px-3 py-3">
        <span className="bg-brand-blue/10 text-brand-blue flex size-7 items-center justify-center rounded-full">
          <Sparkles className="size-3.5" />
        </span>
        <div>
          <p className="text-xs font-semibold">CodeNook review</p>
          <p className="text-muted-foreground mt-0.5 text-[10px]">
            Add quantity to cart totals
          </p>
        </div>
        <span className="text-muted-foreground ml-auto text-[9px]">
          Example
        </span>
      </div>
      <div className="space-y-3 p-3.5">
        <div>
          <p className="text-[10px] font-semibold">Summary</p>
          <p className="text-muted-foreground mt-1 text-[10px] leading-[1.7]">
            The total now accounts for item quantity in the cart.
          </p>
        </div>
        <div className="border-t pt-3">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold">
            <Sparkles className="text-brand-blue size-3" /> Worth checking
          </p>
          <p className="text-muted-foreground mt-1 text-[10px] leading-[1.7]">
            Confirm this matches the existing pricing and discount logic.
          </p>
        </div>
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
