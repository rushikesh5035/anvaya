import { prisma } from "@/lib/prisma";
import { indexCodebase } from "@/module/ai/lib/rag";
import { fetchRepoFileContents } from "@/module/github/lib/github";

import { inngest } from "../client";

export const indexRepository = inngest.createFunction(
  { id: "repository.connected", triggers: { event: "repository.connected" } },

  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    // Fetch all repo files
    const files = await step.run("fetch-repo-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: "github",
        },
      });

      if (!account?.accessToken) {
        throw new Error("No access token found for user");
      }

      return await fetchRepoFileContents(account.accessToken, owner, repo);
    });

    await step.run("index-codebase", async () => {
      await indexCodebase(`${owner}/${repo}`, files);
    });

    return {
      success: true,
      indexedFiles: files.length,
      message: "Repository indexed successfully",
    };
  }
);
