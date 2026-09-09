"use server";

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/prisma";
import { getPullRequestDiff } from "@/module/github/lib/github";

export async function reviewPullRequest({
  owner,
  repoName,
  pullRequestNumber,
}: {
  owner: string;
  repoName: string;
  pullRequestNumber: number;
}) {
  try {
    const repository = await prisma.repository.findFirst({
      where: {
        owner: owner,
        name: repoName,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repository) {
      throw new Error(
        `Repository ${owner}/${repoName} not found in the database. Please reconnect the repository and try again.`
      );
    }

    const githubAccount = repository.user.accounts[0];

    if (!githubAccount) {
      throw new Error(
        `GitHub account for user ${repository.user.id} not found. Please reconnect your GitHub account and try again.`
      );
    }

    const token = githubAccount.accessToken;

    if (!token) {
      throw new Error("GitHub access token not found.");
    }

    // const { title, diff, description } = await getPullRequestDiff(
    //   token,
    //   owner,
    //   repoName,
    //   pullRequestNumber
    // );

    await inngest.send({
      name: "ai/review-pull-request",
      data: {
        owner,
        repoName,
        pullRequestNumber,
        userId: repository.user.id,
      },
    });

    return {
      success: true,
      message: `Review process queued for PR #${pullRequestNumber} in ${owner}/${repoName}`,
    };
  } catch (error) {
    try {
      const repository = await prisma.repository.findFirst({
        where: {
          owner: owner,
          name: repoName,
        },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            pullRequestNumber: pullRequestNumber,
            pullRequestTitle: "Failed to fetch pull request",
            pullRequestUrl: `https://github.com/${owner}/${repoName}/pull/${pullRequestNumber}`,
            review: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            reviewStatus: "failed",
          },
        });
      }
    } catch (dberror) {
      console.error(
        "Error logging review failure to database:",
        dberror instanceof Error ? dberror.message : "Unknown database error"
      );
    }
  }
}
