import { NextRequest, NextResponse } from "next/server";

import { reviewPullRequest } from "@/module/ai/actions";

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body as JSON from the GitHub webhook payload
    const body = await req.json();

    const event = req.headers.get("X-GitHub-Event");

    console.log("Received GitHub webhook event:", event);

    if (event === "ping") {
      return NextResponse.json(
        {
          message: "Ping event received",
        },
        { status: 200 }
      );
    }

    if (event === "pull_request") {
      const action = body.action;
      const repository = body.repository.full_name;
      const pullRequestNumber = body.number;

      console.log(
        `Pull Request ${pullRequestNumber} in ${repository} was ${action}`
      );

      const [owner, repoName] = repository.split("/");

      if (action === "opened" || action === "synchronize") {
        // call function to handle the pull request event
        reviewPullRequest({
          owner,
          repoName,
          pullRequestNumber,
        })
          .then(() => {
            console.log(
              `Review process initiated for PR #${pullRequestNumber} in ${repository}`
            );
          })
          .catch((error: string) => {
            console.error(
              `Review process failed for PR #${pullRequestNumber} in ${repository}:`,
              error
            );
          });
      }
    }

    return NextResponse.json(
      {
        message: "Event Processed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling GitHub webhook:", error);
    return NextResponse.json(
      {
        message: "Error handling GitHub webhook",
      },
      { status: 500 }
    );
  }
}
