import { headers } from "next/headers";

import { Octokit } from "octokit";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionData {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}

/*
- Get Github access token for the currently authenticated user and returns it
- Throws "Unauthorized" if there is no session or no linked Github account
*/
export const getGithubAccessToken = async (): Promise<string> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  // Get the GitHub account associated with the current user from the database
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account?.accessToken)
    throw new Error("GitHub access token not found for the current user");

  return account?.accessToken;
};

/* 
Fetches the contribution calendar for the given Github username using the provided personal access token. Returns calender object
*/
export const getGithubContributions = async (
  token: string,
  username: string
): Promise<ContributionCalendar> => {
  // Create a new Octokit instance with the provided access token
  const octokit = new Octokit({ auth: token });

  // Define the GraphQL query to fetch the user's contributions
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql<ContributionData>(query, {
      username,
    });

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    throw new Error("Failed to fetch GitHub contributions");
  }
};

// Fetches the list of repositories for the given GitHub username using the provided personal access token.
export const getRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  try {
    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });

    // Fetch all private, public etc repositories for the authenticated user
    const { data: privateAndPublicRepos } =
      await octokit.rest.repos.listForAuthenticatedUser({
        sort: "updated",
        direction: "desc",
        visibility: "all", // all, public, private forks repos
        per_page: perPage, // pagination: number of repositories per page
        page, // pagination: current page number
      });

    // console.log("Fetched repositories from GitHub:", privateAndPublicRepos);

    return privateAndPublicRepos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw new Error("Failed to fetch GitHub repositories");
  }
};
