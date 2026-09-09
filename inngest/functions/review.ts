import { google } from "@ai-sdk/google";
import { generateText } from "ai";

import { prisma } from "@/lib/prisma";
import { retrieveContext } from "@/module/ai/lib/rag";
import {
  getPullRequestDiff,
  postReviewComment,
} from "@/module/github/lib/github";

import { inngest } from "../client";

export const generateReview = inngest.createFunction(
  {
    id: "review-pull-request",
    concurrency: 5,
    triggers: { event: "ai/review-pull-request" },
  },
  async ({ event, step }) => {
    const { owner, repoName, pullRequestNumber, userId } = event.data;

    // fetch the pull request diff and description
    const { title, diff, description, token } = await step.run(
      "fetch-pull-request-diff",
      async () => {
        const account = await prisma.account.findFirst({
          where: {
            userId: userId,
            providerId: "github",
          },
        });

        if (!account?.accessToken) {
          throw new Error("No access token found for user");
        }

        // get all the diff for the pull request
        const data = await getPullRequestDiff(
          account.accessToken,
          owner,
          repoName,
          pullRequestNumber
        );

        return {
          ...data,
          token: account.accessToken,
        };
      }
    );

    // retrieve the context for the pull request
    const context = await step.run("retrieve-context", async () => {
      const query = `${title} \n ${description} `;

      return await retrieveContext(query, `${owner}/${repoName}`);
    });

    const review = await step.run("generate-ai-review", async () => {
      const prompt = `You are an expert code reviewer. Analyze the following pull request and provide a detailed, constructive code review.

        PR Title: ${title}
        PR Description: ${description || "No description provided"}

        Context from Codebase:
        ${context.join("\n\n")}

        Code Changes:
        \`\`\`diff
        ${diff}
        \`\`\`

        Please provide:
        1. **Walkthrough**: A file-by-file explanation of the changes.
        2. **Sequence Diagram**: A Mermaid JS sequence diagram visualizing the flow of the changes (if applicable). Use \`\`\`mermaid ... \`\`\` block. **IMPORTANT**: Ensure the Mermaid syntax is valid. Do not use special characters (like quotes, braces, parentheses) inside Note text or labels as it breaks rendering. Keep the diagram simple.
        3. **Summary**: Brief overview.
        4. **Strengths**: What's done well.
        5. **Issues**: Bugs, security concerns, code smells.
        6. **Suggestions**: Specific code improvements.
        7. **Poem**: A short, creative poem summarizing the changes at the very end.

        Format your response in markdown.`;

      const { text } = await generateText({
        model: google("gemini-3.5-flash-lite"),
        prompt: prompt,
      });

      return text;
    });

    // post the review comment on the pull request to GitHub
    await step.run("post-review-comment", async () => {
      await postReviewComment(
        token,
        owner,
        repoName,
        pullRequestNumber,
        review
      );
    });

    // save review to the database
    await step.run("save-review-to-database", async () => {
      const repository = await prisma.repository.findFirst({
        where: {
          owner,
          name: repoName,
        },
      });

      if (repository) {
        await prisma.review.create({
          data: {
            repositoryId: repository.id,
            pullRequestNumber: pullRequestNumber,
            pullRequestTitle: title,
            pullRequestUrl: `https://github.com/${owner}/${repoName}/pull/${pullRequestNumber}  `,
            review: review,
            reviewStatus: "completed",
          },
        });
      }
    });

    return {
      success: true,
      message: `Review process completed for PR #${pullRequestNumber} in ${owner}/${repoName}`,
    };
  }
);
