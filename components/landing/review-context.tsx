import { Database, GitPullRequest, Sparkles } from "lucide-react";

const contextSteps = [
  {
    name: "GitHub",
    detail: "Pull request + repository",
    icon: GitPullRequest,
  },
  {
    name: "Gemini",
    detail: "Repository code embeddings",
    icon: Sparkles,
  },
  {
    name: "Pinecone",
    detail: "Relevant code retrieved",
    icon: Database,
  },
];

export function ReviewContext() {
  return (
    <section
      id="review-context"
      aria-labelledby="review-context-title"
      className="relative isolate overflow-hidden px-5 py-12 sm:px-8 sm:py-12 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="review-context-title"
            className="text-2xl font-semibold tracking-[-0.03em] text-balance lg:text-3xl"
          >
            Reviews grounded in your repository — not just the diff.
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-3xl text-base leading-7 text-pretty sm:text-lg sm:leading-8">
            GitHub brings in the pull request. Gemini and Pinecone surface the
            related code a reviewer needs to consider.
          </p>
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl">
          <div
            aria-hidden="true"
            className="bg-primary/25 pointer-events-none absolute top-5 bottom-5 left-5 w-px md:top-6 md:right-[16.666%] md:bottom-auto md:left-[16.666%] md:h-px md:w-auto"
          />

          <ol className="relative grid gap-8 md:grid-cols-3 md:gap-5">
            {contextSteps.map(({ name, detail, icon: Icon }) => (
              <li
                key={name}
                className="group relative flex items-center gap-4 md:flex-col md:gap-4 md:text-center"
              >
                <div className="border-primary/40 bg-background text-primary group-hover:border-primary/70 group-hover:bg-primary/10 relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors md:size-12">
                  <Icon
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.7}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight">
                    {name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="text-muted-foreground mt-4 mb-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-5 text-xs sm:mb-2">
          <span>
            Built with <span className="text-foreground/80">Next.js</span>
          </span>
          <span
            aria-hidden="true"
            className="bg-border hidden h-3.5 w-px sm:block"
          />
          <span>
            Billing by <span className="text-foreground/80">Polar</span>
          </span>
        </div>
      </div>
    </section>
  );
}
