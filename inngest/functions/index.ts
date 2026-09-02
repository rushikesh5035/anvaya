import { inngest } from "../client";

export const helloWorld = inngest.createFunction(
  { id: "helloworld", triggers: { event: "test/hello.world" } },
  async ({ event, step }) => {
    await step.sleep("Wait-a-moment", "1s");

    return { message: `Hello ${event.data.email}` };
  }
);
