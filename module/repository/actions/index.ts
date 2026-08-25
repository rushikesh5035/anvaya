"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createWebhook, getRepositories } from "@/module/github/lib/github";
import type {
  ConnectRepositoryInput,
  ConnectRepositoryResult,
  RepositoryListItem,
} from "@/module/repository/types";

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

export const connectRepository = async ({
  owner,
  name,
  githubId,
}: ConnectRepositoryInput): Promise<ConnectRepositoryResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const existingRepository = await prisma.repository.findFirst({
      where: {
        userId: session.user.id,
        githubId: BigInt(githubId),
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (existingRepository) {
      return {
        repositoryId: existingRepository.id,
        fullName: existingRepository.fullName,
        alreadyConnected: true,
      };
    }

    await createWebhook(owner, name);

    const repository = await prisma.repository.create({
      data: {
        githubId: BigInt(githubId),
        name,
        owner,
        fullName: `${owner}/${name}`,
        url: `https://github.com/${owner}/${name}`,
        userId: session.user.id,
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    return {
      repositoryId: repository.id,
      fullName: repository.fullName,
      alreadyConnected: false,
    };
  } catch (error) {
    console.error("Error connecting repository:", error);
    throw new Error("Failed to connect repository");
  }
};
