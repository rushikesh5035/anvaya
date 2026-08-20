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

// Converts a raw contributionCount into a 0-4 heat-map level.
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
];

export const getContributionState = async (): Promise<{
  contributions: ContributionDay[];
  totalContributions: number;
} | null> => {
  try {
    // Get the current session from the auth API
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) throw new Error("Unauthorized");

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.rest.users.getAuthenticated();

    const username = user.login;

    const calendar = await getGithubContributions(token, username);

    if (!calendar) return null;

    const contributions: ContributionDay[] = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: toLevel(day.contributionCount),
      }))
    );

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    console.error("Error fetching contribution stats:", error);
    return null;
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) throw new Error("Unauthorized");

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });
    const { data: user } = await octokit.rest.users.getAuthenticated();

    // TODO: Fetch total connected repos from DB
    const totalRepos = 30;

    // Fetch github contributions from the github api using the access token
    const calender: ContributionCalendar = await getGithubContributions(
      token,
      user.login
    );
    const totalCommits = calender?.totalContributions || 0;

    // Count PR's from DB or Github
    const { data: pullRequst } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      });

    const totalPRs = pullRequst.total_count;

    // TODO: Count AI Reviews from DB
    const totalAIReviews = 10;

    return {
      totalRepos,
      totalCommits,
      totalPRs,
      totalAIReviews,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    return {
      totalRepos: 0,
      totalCommits: 0,
      totalPRs: 0,
      totalAIReviews: 0,
    };
  }
};

export const getMonthlyActivity = async (): Promise<MonthlyActivityItem[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });

    // get users github username from the database
    const { data: user } = await octokit.rest.users.getAuthenticated();

    const calender = await getGithubContributions(token, user.login);
    if (!calender) return [];

    // group contributions data by month and year
    const monthlyData: Record<
      string,
      { commits: number; prs: number; aiReviews: number }
    > = {};

    // initialize last 6 month data
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const monthKey = MONTH_NAMES[date.getMonth()];

      monthlyData[monthKey] = { commits: 0, prs: 0, aiReviews: 0 };
    }

    calender.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const monthKey = MONTH_NAMES[date.getMonth()];

        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    // Fetch review from db for last 6 month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // TODO: REVIEWS REAL DATA
    const generateSampleReviews = () => {
      const sampleReviews = [];
      const now = new Date();

      // generate random reviewd over the past 6 months
      for (let i = 0; i < 6; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 180); // Random days in last 6 months
        const reviewDate = new Date(now);
        reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

        sampleReviews.push({
          createdAt: reviewDate,
        });
      }

      return sampleReviews;
    };

    const reviews = generateSampleReviews();

    reviews.forEach((review) => {
      const monthKey = MONTH_NAMES[review.createdAt.getMonth()];

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].aiReviews += 1;
      }
    });

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${sixMonthsAgo.toISOString().split("T")[0]}`,
      per_page: 100,
    });

    prs.items.forEach((pr) => {
      const date = new Date(pr.created_at);
      const monthKey = MONTH_NAMES[date.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    return Object.keys(monthlyData).map((month) => ({
      month,
      ...monthlyData[month],
    }));
  } catch (error) {
    console.error("Failed to fetch monthly activity", error);
    return [];
  }
};
