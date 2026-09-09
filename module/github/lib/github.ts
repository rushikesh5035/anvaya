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

const getAppBaseUrl = () => {
  const appBaseUrl =
    process.env.APP_BASE_URL ?? process.env.NEXT_PUBLIC_APP_BASE_URL;

  if (!appBaseUrl) {
    throw new Error("APP_BASE_URL is not configured");
  }

  return appBaseUrl;
};

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

    return privateAndPublicRepos;
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    throw new Error("Failed to fetch GitHub repositories");
  }
};

export const createWebhook = async (owner: string, repo: string) => {
  try {
    const appBaseUrl = getAppBaseUrl();

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });

    const webhookUrl = `${appBaseUrl}/api/webhooks/github`;

    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const existingHook = hooks.find((hook) => hook.config.url === webhookUrl);

    if (existingHook) {
      return existingHook;
    }

    const { data: newHook } = await octokit.rest.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: "json",
      },
      events: ["pull_request"],
    });

    return newHook;
  } catch (error) {
    console.error("Error creating GitHub webhook:", error);
    throw new Error("Failed to create GitHub webhook");
  }
};

export const deleteWebhook = async (owner: string, repo: string) => {
  try {
    const appBaseUrl = getAppBaseUrl();

    const token = await getGithubAccessToken();
    const octokit = new Octokit({ auth: token });

    const webhookUrl = `${appBaseUrl}/api/webhooks/github`;

    // Get the list of webhooks for the repository
    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    // Check if the webhook exists before attempting to delete it
    const existingHook = hooks.find((hook) => hook.config.url === webhookUrl);

    if (existingHook) {
      await octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: existingHook.id,
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error deleting GitHub webhook:", error);
    throw new Error("Failed to delete GitHub webhook");
  }
};

export const fetchRepoFileContents = async (
  token: string,
  owner: string,
  repo: string,
  path: string = ""
): Promise<{ path: string; content: string }[]> => {
  try {
    const octokit = new Octokit({ auth: token });

    const { data: files } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    if (!Array.isArray(files)) {
      // It's a file
      if (files.type === "file" && files.content) {
        return [
          {
            path: files.path,
            content: Buffer.from(files.content, "base64").toString("utf-8"),
          },
        ];
      }
      return [];
    }

    let filesWithContents: { path: string; content: string }[] = [];

    for (const file of files) {
      if (file.type === "file") {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
        });

        if (
          !Array.isArray(fileData) &&
          fileData.type === "file" &&
          fileData.content
        ) {
          // filter out non-code files if needed (images, etc)
          // for now, let's include everything that looks like a text file
          if (
            !file.path.match(
              /\.(png|jpg|jpeg|gif|pdf|bmp|svg|ico|zip|tar|gz)$/i
            )
          ) {
            filesWithContents.push({
              path: fileData.path,
              content: Buffer.from(fileData.content, "base64").toString(
                "utf-8"
              ),
            });
          }
        }
      } else if (file.type === "dir") {
        // Recursively fetch files in subdirectories
        const subdirectoryFiles = await fetchRepoFileContents(
          token,
          owner,
          repo,
          file.path
        );
        filesWithContents = filesWithContents.concat(subdirectoryFiles);
      }
    }

    return filesWithContents;
  } catch (error) {
    console.error("Error fetching GitHub repository file contents:", error);
    throw new Error("Failed to fetch GitHub repository file contents");
  }
};
