"use client";

import { ActivityCalendar } from "react-activity-calendar";

import { useTheme } from "next-themes";

import { useQuery } from "@tanstack/react-query";

import { getContributionState } from "../actions";

const ContributionGraph = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => getContributionState(),
    staleTime: 1000 * 60 * 5,
  });

  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex min-w-max justify-center">
          <ActivityCalendar data={[]} loading />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex w-full items-center justify-center p-8">
        <p className="text-muted-foreground text-sm">
          Failed to load contribution data. Please try again later.
        </p>
      </div>
    );
  }

  if (!data || !data.contributions.length) {
    return (
      <div className="item-center flex w-full flex-col justify-center p-8">
        <div className="text-muted-foreground animate-pulse">
          No contribution data available
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="text-muted-foreground text-sm">
        <span className="text-foreground font-semibold">
          {data.totalContributions}{" "}
        </span>
        contributions in the last year
      </div>

      <div className="w-full overflow-x-auto">
        <div className="flex min-w-max justify-center">
          <ActivityCalendar
            data={data.contributions}
            colorScheme={theme === "dark" ? "dark" : "light"}
            blockSize={12}
            blockMargin={4}
            fontSize={12}
            showMonthLabels
            theme={{
              light: ["hsl(0, 0%, 92%)", "hsl(142, 71%, 45%)"],
              dark: ["#161b22", "hsl(142, 71%, 45%)"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
