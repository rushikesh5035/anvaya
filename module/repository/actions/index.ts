"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRepositories } from "@/module/github/lib/github";
import type { RepositoryListItem } from "@/module/repository/types";

// fetches the list of repositories for the currently authenticated user and returns it
export const getUserRepositories = async (
  page: number = 1,
  perPage: number = 10
): Promise<RepositoryListItem[]> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    // fetch repositories from GitHub API using the provided page and perPage
    const repositories = await getRepositories(page, perPage);

    // fetch connected repositories stored in the database
    const dbStoredRepositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        githubId: true,
      },
    });

    // Create a set of connected repository IDs for quick lookup
    const connectedRepoIds = new Set(
      dbStoredRepositories.map((repo) => repo.githubId)
    );

    return repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      isPrivate: repo.private,
      isConnected: connectedRepoIds.has(BigInt(repo.id)),
    }));
  } catch (error) {
    console.error("Error fetching user repositories:", error);
    return [];
  }
};
