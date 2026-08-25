import { NextRequest, NextResponse } from "next/server";

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
