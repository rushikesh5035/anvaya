"use client";

import { useQuery } from "@tanstack/react-query";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  MessageSquare,
} from "lucide-react";

import { getDashboardStats } from "../actions";
import StatCard from "./stat-card";

const DashboardStatsSection = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => getDashboardStats(),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="grid gap-5 md:grid-cols-4">
      <StatCard
        icon={<GitBranch className="h-4 w-4" />}
        title="Total Repositories"
        value={stats?.totalRepos ?? 0}
        description="Connected repositories"
        isLoading={isLoading}
      />
      <StatCard
        icon={<GitCommit className="h-4 w-4" />}
        title="Total Commits"
        value={stats?.totalCommits ?? 0}
        description="In the last year"
        isLoading={isLoading}
      />
      <StatCard
        icon={<GitPullRequest className="h-4 w-4" />}
        title="Pull Requests"
        value={stats?.totalPRs ?? 0}
        description="All time"
        isLoading={isLoading}
      />
      <StatCard
        icon={<MessageSquare className="h-4 w-4" />}
        title="AI Reviews"
        value={stats?.totalAIReviews ?? 0}
        description="Generated reviews"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardStatsSection;
