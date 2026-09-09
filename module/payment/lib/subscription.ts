"use server";

import { prisma } from "@/lib/prisma";

export type subscriptionTier = "FREE" | "PRO";
export type subscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED";

export interface UserLimits {
  tier: subscriptionTier;
  repositories: {
    current: number;
    limit: number | null; // null means unlimited
    canAdd: boolean;
  };

  reviews: {
    [repositoryId: string]: {
      current: number;
      limit: number | null;
      canAdd: boolean;
    };
  };
}

const TIER_LIMITS = {
  FREE: {
    repositories: 3,
    reviewPerRepository: 5,
  },
  PRO: {
    repositories: null, // unlimited
    reviewPerRepository: null, // unlimited
  },
} as const;

// get the limits for a user based on their subscription tier
export const getUserTier = async (
  userId: string
): Promise<subscriptionTier> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });

  return (user?.subscriptionTier as subscriptionTier) || "FREE";
};

// get the usage for a user, if not exists, create a new one
const getUserUsage = async (userId: string) => {
  let usage = await prisma.userUsage.findUnique({
    where: { userId },
  });

  if (!usage) {
    usage = await prisma.userUsage.create({
      data: {
        userId,
        repositoryCount: 0,
        reviewCount: {},
      },
    });
  }

  return usage;
};

// check if a user can connect a new repository based on their subscription tier and usage
export const canConnectRepository = async (
  userId: string
): Promise<boolean> => {
  const tier = await getUserTier(userId);

  if (tier === "PRO") return true; // unlimited repositories for PRO users

  //
  const usage = await getUserUsage(userId);
  const limit = TIER_LIMITS.FREE.repositories;

  return usage.repositoryCount < limit;
};

// check if a user
export const canCreateReview = async (
  userId: string,
  repositoryId: string
): Promise<boolean> => {
  const tier = await getUserTier(userId);

  if (tier === "PRO") return true;

  const usage = await getUserUsage(userId);
  const reviewCounts = usage.reviewCount as Record<string, number>;
  const currentCount = reviewCounts[repositoryId] || 0;
  const limit = TIER_LIMITS.FREE.reviewPerRepository;

  return currentCount < limit;
};

// Increment repository count for user
export const incrementRepositoryCount = async (
  userId: string
): Promise<void> => {
  await prisma.userUsage.upsert({
    where: { userId },
    create: {
      userId,
      repositoryCount: 1,
      reviewCounts: {},
    },
    update: {
      repositoryCount: {
        increment: 1,
      },
    },
  });
};

// Decrement repository count for user
export const decrementRepositoryCount = async (
  userId: string
): Promise<void> => {
  const usage = await getUserUsage(userId);

  await prisma.userUsage.update({
    where: { userId },
    data: {
      repositoryCount: Math.max(0, usage.repositoryCount - 1),
    },
  });
};

export const incrementReviewCount = async (
  userId: string,
  repositoryId: string
): Promise<void> => {
  const usage = await getUserUsage(userId);
  const reviewCounts = usage.reviewCount as Record<string, number>;

  reviewCounts[repositoryId] = (reviewCounts[repositoryId] || 0) + 1;

  await prisma.userUsage.update({
    where: { userId },
    data: {
      reviewCounts,
    },
  });
};

export const getRemainingLimits = async (
  userId: string
): Promise<UserLimits> => {
  const tier = await getUserTier(userId);
  const usage = await getUserUsage(userId);
  const reviewCounts = usage.reviewCount as Record<string, number>;

  const limits: UserLimits = {
    tier,
    repositories: {
      current: usage.repositoryCount,
      limit: tier === "PRO" ? null : TIER_LIMITS.FREE.repositories,
      canAdd:
        tier === "PRO" || usage.repositoryCount < TIER_LIMITS.FREE.repositories,
    },
    reviews: {},
  };

  // Get all user's repositories
  const repositories = await prisma.repository.findMany({
    where: { userId },
    select: { id: true },
  });

  // Calculate limits for each repository
  for (const repo of repositories) {
    const currentCount = reviewCounts[repo.id] || 0;
    limits.reviews[repo.id] = {
      current: currentCount,
      limit: tier === "PRO" ? null : TIER_LIMITS.FREE.reviewPerRepository,
      canAdd:
        tier === "PRO" || currentCount < TIER_LIMITS.FREE.reviewPerRepository,
    };
  }

  return limits;
};

export const updateUserTier = async (
  userId: string,
  tier: subscriptionTier,
  status: subscriptionStatus,
  polarSubscriptionId?: string
): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: tier,
      subscriptionStatus: status,
    },
  });
};
