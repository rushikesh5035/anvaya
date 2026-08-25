"use server";

import { headers } from "next/headers";

import { Octokit } from "octokit";

import { auth } from "@/lib/auth";
import {
  ContributionCalendar,
  getGithubAccessToken,
  getGithubContributions,
} from "@/module/github/lib/github";

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface DashboardStats {
  totalRepos: number;
  totalCommits: number;
  totalPRs: number;
  totalAIReviews: number;
}

export interface MonthlyActivityItem {
  month: string;
  commits: number;
  prs: number;
  aiReviews: number;
}

function toLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const getAuthenticatedUser = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const token = await getGithubAccessToken();
  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.rest.users.getAuthenticated();

  return { session, token, username: user.login, octokit };
};

export const getContributionState = async (): Promise<{
  contributions: ContributionDay[];
  totalContributions: number;
} | null> => {
  try {
    const { token, username } = await getAuthenticatedUser();

    const calendar = await getGithubContributions(token, username);
    if (!calendar) return null;

    const contributions: ContributionDay[] = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: toLevel(day.contributionCount),
      }))
    );

    return { contributions, totalContributions: calendar.totalContributions };
  } catch (error) {
    console.error("Error fetching contribution stats:", error);
    return null;
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const { token, username, octokit } = await getAuthenticatedUser();

    // TODO: DB query once repository tracking is implemented
    const totalRepos = 0;

    const calendar: ContributionCalendar = await getGithubContributions(
      token,
      username
    );
    const totalCommits = calendar?.totalContributions ?? 0;

    const { data: pullRequests } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${username} type:pr`,
        per_page: 1,
      });
    const totalPRs = pullRequests.total_count;

    // TODO: DB query once AI review tracking is implemented
    const totalAIReviews = 0;

    return { totalRepos, totalCommits, totalPRs, totalAIReviews };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return { totalRepos: 0, totalCommits: 0, totalPRs: 0, totalAIReviews: 0 };
  }
};

export const getMonthlyActivity = async (): Promise<MonthlyActivityItem[]> => {
  try {
    const { token, username, octokit } = await getAuthenticatedUser();

    const calendar = await getGithubContributions(token, username);
    if (!calendar) return [];

    const now = new Date();

    const months: { key: string; label: string }[] = [];
    const monthlyData: Record<
      string,
      { commits: number; prs: number; aiReviews: number }
    > = {};

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const label = MONTH_NAMES[date.getMonth()];
      months.push({ key, label });
      monthlyData[key] = { commits: 0, prs: 0, aiReviews: 0 };
    }

    // Accumulate commits from the GitHub contribution calendar.
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (monthlyData[key]) {
          monthlyData[key].commits += day.contributionCount;
        }
      });
    });

    // Accumulate PRs from the GitHub Search API for the last 12 months.
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${username} type:pr created:>${twelveMonthsAgo.toISOString().split("T")[0]}`,
      per_page: 100,
    });

    prs.items.forEach((pr) => {
      const date = new Date(pr.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (monthlyData[key]) {
        monthlyData[key].prs += 1;
      }
    });

    // TODO: DB query for AI reviews per month

    // Map internal year-safe keys back to display labels for the chart.
    return months.map(({ key, label }) => ({
      month: label,
      ...monthlyData[key],
    }));
  } catch (error) {
    console.error("Failed to fetch monthly activity:", error);
    return [];
  }
};
