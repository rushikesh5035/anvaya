import {
  Check,
  CircleDashed,
  FileCode2,
  GitPullRequest,
  LeafyGreen,
  MessageSquareCode,
  SearchCode,
  Sparkles,
} from "lucide-react";

function RepositoryReviewVisual() {
  return (
    <div
      aria-hidden="true"
      className="border-brand-blue/25 absolute inset-x-5 top-6 bottom-28 overflow-hidden rounded-lg border bg-[#050b12]/90 sm:inset-x-7 sm:top-7 sm:bottom-32"
    >
      <div className="flex h-9 items-center gap-2 border-b border-white/10 bg-white/[0.025] px-3 sm:h-10 sm:px-4">
        <span className="bg-brand-blue/15 text-brand-blue flex size-5 items-center justify-center rounded-md">
          <GitPullRequest className="size-3" />
        </span>
        <span className="truncate text-[9px] font-medium text-white/90 sm:text-[10px]">
          Add quantity to cart totals
        </span>
        <span className="ml-auto shrink-0 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[7px] tracking-wide text-white/45">
          EXAMPLE
        </span>
      </div>

      <div className="grid h-[calc(100%-36px)] grid-rows-[1fr_auto] sm:h-[calc(100%-40px)] sm:grid-cols-[1.1fr_0.9fr] sm:grid-rows-1">
        <div className="min-w-0 overflow-hidden border-b border-white/10 font-mono text-[8px] leading-5 text-white/55 sm:border-r sm:border-b-0 sm:text-[9px]">
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2 text-[7px] text-white/40 sm:px-4">
            <FileCode2 className="text-brand-blue/80 size-3" />
            <span>src/cart/total.ts</span>
            <span className="ml-auto">TypeScript</span>
          </div>
          <div className="overflow-hidden px-3 py-2.5 sm:px-4 sm:py-3">
            <p className="truncate text-white/45">
              <span className="mr-3 text-white/25">41</span>export function
              calculateTotal(items) &#123;
            </p>
            <p className="truncate">
              <span className="mr-3 text-white/25">42</span> return
              items.reduce(
            </p>
            <p
              className={
                "border-brand-blue bg-brand-blue/10 -mx-3 truncate border-l-2 px-3 text-white sm:-mx-4 sm:px-4"
              }
            >
              <span className="text-brand-blue mr-3">43</span>+ item.price *
              item.quantity
            </p>
            <p className="truncate text-white/45">
              <span className="mr-3 text-white/25">44</span>&#125;
            </p>
          </div>
        </div>
        <div className="hidden min-w-0 p-3 sm:block sm:p-4">
          <p className="mb-2.5 flex items-center gap-1.5 font-mono text-[7px] tracking-[0.12em] text-white/50">
            <SearchCode className="text-brand-blue size-3.5" />
            REPOSITORY CONTEXT
          </p>
          <div className="space-y-2">
            {[
              { file: "cart/pricing.ts", detail: "discount order" },
              { file: "types/cart-item.ts", detail: "item shape" },
              { file: "cart/discounts.ts", detail: "price adjustments" },
            ].map(({ file, detail }) => (
              <div
                key={file}
                className={
                  "min-w-0 border-b border-white/[0.07] pb-2 last:border-0"
                }
              >
                <p className="flex min-w-0 items-center gap-1.5 font-mono text-[8px] text-white/80">
                  <FileCode2 className="text-brand-blue size-3 shrink-0" />
                  <span className="truncate">{file}</span>
                </p>
                <p className="mt-1 pl-[18px] text-[7px] text-white/40">
                  {detail}
                </p>
              </div>
            ))}
          </div>
          <div className="text-brand-blue/80 mt-2 flex items-center gap-1.5 text-[7px]">
            <Sparkles className="size-3" />
            Context considered with the diff
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-hidden px-3 py-2 sm:hidden">
          <SearchCode className="text-brand-blue size-3 shrink-0" />
          <span className="shrink-0 text-[7px] text-white/45">
            Related files
          </span>
          <span
            className={
              "truncate rounded border border-white/10 px-1.5 py-1 font-mono text-[7px] text-white/60"
            }
          >
            cart/pricing.ts
          </span>
          <span
            className={
              "truncate rounded border border-white/10 px-1.5 py-1 font-mono text-[7px] text-white/60"
            }
          >
            types/cart-item.ts
          </span>
        </div>
      </div>
    </div>
  );
}

function StructuredReviewVisual() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-5 top-6 bottom-28 sm:inset-x-7 sm:top-7 sm:bottom-32"
    >
      <div className="border-brand-blue/20 mx-auto max-w-sm overflow-hidden rounded-lg border bg-[#050b12]/90">
        <div className="flex items-center gap-2.5 border-b border-white/10 bg-white/[0.025] px-3 py-2.5">
          <span className="bg-brand-blue/15 text-brand-blue flex size-7 shrink-0 items-center justify-center rounded-lg">
            <Sparkles className="size-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-semibold">Review summary</p>
            <p className="mt-0.5 truncate font-mono text-[7px] text-white/45">
              acme / storefront · pull request #128
            </p>
          </div>
          <span className="text-brand-blue border-brand-blue/25 ml-auto shrink-0 rounded-full border px-2 py-1 text-[7px]">
            AI REVIEW
          </span>
        </div>
        <div className="space-y-2.5 p-3 sm:p-3.5">
          <div className={""}>
            <p className="mb-1 font-mono text-[7px] tracking-[0.12em] text-white/45">
              WALKTHROUGH
            </p>
            <p className="text-[8px] leading-4 text-white/75">
              Each cart line now includes the item quantity in its total.
            </p>
          </div>
          <div
            className={
              "border-brand-blue/20 bg-brand-blue/[0.07] rounded-lg border p-2.5"
            }
          >
            <p className="mb-1 flex items-center gap-1.5 text-[8px] font-medium text-white/90">
              <SearchCode className="text-brand-blue size-3" />
              Potential issue to check
            </p>
            <p className="text-[8px] leading-4 text-white/60">
              Confirm discounts still apply after quantity is included.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-white/10 pt-2 text-[7px] text-white/45">
            <span>Summary</span>
            <span>Strengths</span>
            <span>Suggestions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GitHubReviewVisual() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-5 top-6 bottom-24 sm:inset-x-6 sm:top-7 sm:bottom-28"
    >
      <div className="mx-auto max-w-xs pt-1">
        <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2.5">
          <span className="flex items-center gap-1.5 text-[8px] font-medium text-white/75">
            <GitPullRequest className="text-brand-blue size-3.5" />
            GitHub pull request
          </span>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[7px] text-white/45">
            Illustrative
          </span>
        </div>
        <div className="relative space-y-2.5 pl-5">
          <div className="bg-brand-blue/70 absolute top-2 bottom-5 left-[5px] w-px" />
          {[
            {
              icon: GitPullRequest,
              title: "Pull request opened",
              detail: "GitHub event received",
            },
            {
              icon: Sparkles,
              title: "Review generated",
              detail: "Diff + relevant repository code",
            },
            {
              icon: Check,
              title: "Comment posted",
              detail: "Feedback appears on the PR",
            },
          ].map(({ icon: Icon, title, detail }, index) => (
            <div key={title} className="relative flex items-center gap-2.5">
              <span
                className={`absolute -left-5 flex size-[11px] items-center justify-center rounded-full border ${index === 2 ? "border-brand-blue bg-brand-blue text-black" : "border-brand-blue/60 text-brand-blue bg-[#03070b]"}`}
              >
                <Icon className="size-2" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[8px] font-medium text-white/85">
                  {title}
                </p>
                <p className="mt-0.5 truncate text-[7px] text-white/45">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewHistoryVisual() {
  const rows = [
    {
      title: "Add quantity to cart totals",
      repository: "storefront",
      pr: "#128",
      status: "Done",
    },
    {
      title: "Rotate refresh tokens",
      repository: "identity-api",
      pr: "#84",
      status: "Done",
    },
    {
      title: "Update checkout flow",
      repository: "storefront",
      pr: "#131",
      status: "Queued",
    },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-5 top-6 bottom-24 sm:inset-x-6 sm:top-7 sm:bottom-28"
    >
      <div className="border-brand-blue/20 overflow-hidden rounded-lg border bg-[#050b12]/90">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-3 py-2.5 text-[9px]">
          <span className="font-medium">Review history</span>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[7px] text-white/45">
            EXAMPLE
          </span>
        </div>
        <div className="divide-y divide-white/[0.07] px-3">
          {rows.map((row, index) => (
            <div key={row.title} className="flex items-center gap-2 py-2.5">
              <span className="bg-brand-blue/10 text-brand-blue flex size-6 shrink-0 items-center justify-center rounded-md font-mono text-[7px]">
                {row.pr}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[8px] font-medium text-white/85 sm:text-[9px]">
                  {row.title}
                </p>
                <p className="mt-0.5 truncate text-[7px] text-white/40">
                  acme / {row.repository}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-[7px] text-white/50 sm:text-[8px]">
                {index < 2 ? (
                  <Check className="text-brand-blue size-2.5" />
                ) : (
                  <CircleDashed className="size-2.5" />
                )}
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RepositoryChatVisual() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-5 top-6 bottom-24 sm:inset-x-6 sm:top-7 sm:bottom-28"
    >
      <div className="border-brand-blue/20 mx-auto max-w-xs overflow-hidden rounded-lg border bg-[#050b12]/85">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-3 py-2.5">
          <span className="flex items-center gap-1.5 text-[8px] font-medium text-white/75">
            <MessageSquareCode className="text-brand-blue size-3.5" />
            Repository chat
          </span>
          <span className="text-brand-blue/80 font-mono text-[7px]">
            CONCEPT
          </span>
        </div>
        <div className="space-y-2.5 p-3">
          <div className="bg-brand-blue/15 ml-auto max-w-[90%] rounded-lg rounded-br-sm px-2.5 py-2 text-[8px] leading-4 text-white/85">
            Where is checkout validation handled?
          </div>
          <div className="max-w-[94%] rounded-lg rounded-bl-sm border border-white/10 bg-black/35 px-2.5 py-2 text-[8px] leading-4 text-white/65">
            Follow the request through the relevant files and explain how they
            connect.
            <div className="mt-2 flex flex-wrap gap-1">
              {["checkout/validate.ts", "api/checkout.ts"].map((file) => (
                <span
                  key={file}
                  className="text-brand-blue/90 flex items-center gap-1 rounded border border-white/10 px-1.5 py-1 font-mono text-[6px]"
                >
                  <FileCode2 className="size-2.5" /> {file}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Reviews grounded in your codebase",
    description:
      "CodeNook brings relevant repository files into the review, so changes are considered in context—not in isolation.",
    visual: RepositoryReviewVisual,
    fadePosition: "top-[72%] bottom-0",
    className: "md:col-span-7 md:min-h-[410px]",
  },
  {
    title: "Understand what needs attention",
    description:
      "Get a walkthrough, strengths, potential issues, and practical suggestions you can verify.",
    visual: StructuredReviewVisual,
    className: "md:col-span-5 md:min-h-[410px]",
  },
  {
    title: "Right in your GitHub workflow",
    description:
      "A pull request triggers the review, and the completed feedback is posted back to GitHub.",
    visual: GitHubReviewVisual,
    className: "md:col-span-4 md:min-h-[390px]",
  },
  {
    title: "Pick up where you left off",
    description:
      "Revisit completed and in-progress reviews from your CodeNook dashboard.",
    visual: ReviewHistoryVisual,
    className: "md:col-span-4 md:min-h-[390px]",
  },
  {
    title: "Chat with your repository",
    description:
      "Coming soon: ask questions about your codebase and trace how its pieces fit together.",
    visual: RepositoryChatVisual,
    className: "md:col-span-4 md:min-h-[390px]",
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="px-5 py-14 sm:px-8 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="border-brand-blue/20 bg-brand-blue/5 text-foreground mb-3 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium">
            <LeafyGreen
              aria-hidden="true"
              className="text-brand-blue size-3.5"
            />
            Features
          </div>
          <h2
            id="features-title"
            className="text-2xl font-semibold tracking-[-0.03em] text-balance sm:text-3xl"
          >
            AI code review, with the context to make it useful.
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-2xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
            See how CodeNook understands the change, explains what matters, and
            brings the review back to GitHub.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:mt-11 md:grid-cols-12">
          {features.map(
            ({
              title,
              description,
              visual: Visual,
              className,
              fadePosition,
            }) => (
              <article
                key={title}
                className={`border-brand-blue/20 bg-background relative isolate flex min-h-87.5 min-w-0 flex-col overflow-hidden rounded-lg border p-5 sm:min-h-92.5 sm:p-6 lg:p-7 ${className}`}
              >
                {/* <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  background: `radial-gradient(ellipse 92% 78% at 50% 0%, color-mix(in srgb, var(--brand-blue) 34%, transparent) 0%, color-mix(in srgb, var(--brand-blue) 15%, transparent) 47%, transparent 82%), #03070b`,
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to top, #03070b 0%, rgb(3 7 11 / 0.98) 18%, rgb(3 7 11 / 0.82) 34%, rgb(3 7 11 / 0.35) 53%, transparent 76%)",
                }}
              /> */}

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
                  className={`to-background pointer-events-none absolute inset-x-0 z-10 bg-linear-to-b from-transparent ${fadePosition ?? "top-[44%] bottom-34"}`}
                />
                <Visual />

                <div className="relative z-20 mt-auto pt-4 sm:pt-4 md:pt-4">
                  <h3 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                    {title}
                  </h3>
                  <p className="mt-1.5 max-w-xl text-sm leading-5 text-white/70 sm:leading-6">
                    {description}
                  </p>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
