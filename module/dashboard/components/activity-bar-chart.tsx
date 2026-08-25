"use client";

import { useSyncExternalStore } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { getMonthlyActivity } from "../actions";

const ActivityBarChart = () => {
  const {
    data: monthlyActivity,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: async () => await getMonthlyActivity(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // useSyncExternalStore: returns false on the server, true on the client.
  // Avoids the setState-in-effect lint error and has no cascading render cost.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-80 w-full items-center justify-center">
          <Spinner />
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex h-80 w-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Failed to load activity data. Please try again later.
          </p>
        </div>
      );
    }

    if (!monthlyActivity || monthlyActivity.length === 0) {
      return (
        <div className="flex h-80 w-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            No activity data available.
          </p>
        </div>
      );
    }
    return (
      <div className="h-80 w-full">
        {/* Only render the chart after mount — ResponsiveContainer needs real DOM dimensions */}
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
                itemStyle={{
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              <Bar
                dataKey="commits"
                name="Commits"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="prs"
                name="Pull Requests"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="aiReviews"
                name="AI Reviews"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>
            Monthly breakdown of commits, PRs, and review (last 1 years)
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default ActivityBarChart;
