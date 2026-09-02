"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteWebhook } from "@/module/github/lib/github";
import type {
  ConnectedRepository,
  DisconnectAllRepositoriesResult,
  DisconnectRepositoryResult,
  UpdateUserProfileInput,
  UpdateUserProfileResult,
  UserProfile,
} from "@/module/settings/types";

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const userProfile = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const updateUserProfile = async ({
  name,
}: UpdateUserProfileInput): Promise<UpdateUserProfileResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const trimmedName = name.trim();

    if (!trimmedName) {
      return {
        success: false,
        message: "Name is required",
      };
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: trimmedName,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/dashboard/settings", "page");

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      message: "Failed to update user profile",
    };
  }
};

export const getConnectedRepositories = async (): Promise<
  ConnectedRepository[]
> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const connectedRepositories = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return connectedRepositories;
  } catch (error) {
    console.error("Error fetching connected repositories:", error);
    return [];
  }
};

export const disconnectRepository = async (
  repositoryId: string
): Promise<DisconnectRepositoryResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) throw new Error("Unauthorized");

    const repository = await prisma.repository.findFirst({
      where: {
        id: repositoryId,
        userId: session.user.id,
      },
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    await deleteWebhook(repository.owner, repository.name);

    await prisma.repository.delete({
      where: {
        id: repository.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");

    return {
      success: true,
      message: "Repository disconnected successfully",
    };
  } catch (error) {
    console.error("Error disconnecting repository:", error);
    return {
      success: false,
      message: "Failed to disconnect repository",
    };
  }
};

export const disconnectAllRepositories =
  async (): Promise<DisconnectAllRepositoriesResult> => {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user) throw new Error("Unauthorized");

      const repositories = await prisma.repository.findMany({
        where: {
          userId: session.user.id,
        },
      });

      // delete all the connected repositories webhooks from GitHub
      await Promise.all(
        repositories.map(async (repository) => {
          await deleteWebhook(repository.owner, repository.name);
        })
      );

      // delete all the connected repositories from the database
      const deletedRepositories = await prisma.repository.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      revalidatePath("/dashboard/settings", "page");
      revalidatePath("/dashboard/repository", "page");

      return {
        success: true,
        count: deletedRepositories.count,
        message: "All repositories disconnected successfully",
      };
    } catch (error) {
      console.error("Error disconnecting all repositories:", error);
      return {
        success: false,
        message: "Failed to disconnect all repositories",
      };
    }
  };
