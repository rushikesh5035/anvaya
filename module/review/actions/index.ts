"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const getUserReviews = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error("Unauthorized");

    const reviews = await prisma.review.findMany({
      where: {
        repository: {
          userId: session.user.id,
        },
      },
      include: {
        repository: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return reviews;
  } catch (error) {
    console.error("Failed to fetch user reviews:", error);
    throw new Error("Failed to fetch user reviews");
  }
};
