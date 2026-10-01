"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { polarClient } from "../config/polar";
import { getRemainingLimits, updateUserTier } from "../lib/subscription";

export interface SubscriptionData {
  user: {
    id: string;
    name: string;
    email: string;
    subscriptionTier: string;
    subscriptionStatus: string | null;
    polarCustomerId: string | null;
    polarSubscriptionId: string | null;
  } | null;
  limits: {
    tier: "FREE" | "PRO";
    repositories: {
      current: number;
      limit: number | null;
      canAdd: boolean;
    };
    reviews: {
      [repositoryId: string]: {
        current: number;
        limit: number | null;
        canAdd: boolean;
      };
    };
  } | null;
}

export const getSubscriptionData = async (): Promise<SubscriptionData> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { user: null, limits: null };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { user: null, limits: null };
  }

  const limits = await getRemainingLimits(user.id);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      subscriptionTier: user.subscriptionTier || "FREE",
      subscriptionStatus: user.subscriptionStatus || null,
      polarCustomerId: user.polarCustomerId || null,
      polarSubscriptionId: user.polarSubscriptionId || null,
    },
    limits,
  };
};

export const syncSubscriptionStatus = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.polarCustomerId) {
    return {
      success: false,
      message: "User not found or no Polar customer ID",
    };
  }

  try {
    // get subscriptions from polar
    const result = await polarClient.subscriptions.list({
      customerId: user.polarCustomerId,
    });

    const subscriptions = result.result?.items || [];

    // font the most relevant subscription (active or most recent)
    const activeSub = subscriptions.find((sub) => sub.status === "active");
    const latestSub = subscriptions[0];

    if (activeSub) {
      await updateUserTier(user.id, "PRO", "ACTIVE", activeSub.id);
      return { success: true, status: "ACTIVE" };
    } else if (latestSub) {
      // if latest is cancelled/expired
      const status = latestSub.status === "canceled" ? "CANCELED" : "EXPIRED";

      // only downgrade if we are sure it's not active
      if (latestSub.status !== "active") {
        await updateUserTier(user.id, "FREE", status, latestSub.id);
      }

      return { success: true, status };
    }
  } catch (error) {
    console.log("Failed to sync subscription", error);
    return { success: false, error: "Failed to sync with polar" };
  }
};
