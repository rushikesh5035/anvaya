import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { polarClient } from "@/module/payment/config/polar";
import {
  updatePolarCustomerId,
  updateUserTier,
} from "@/module/payment/lib/subscription";

import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      scope: ["repo"],
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000",
  ],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "388e9aa4-5efd-48f9-9579-ee2598b7f9d7",
              slug: "pro",
            },
          ],
          successUrl:
            process.env.POLAR_SUCCESS_URL ||
            "/dashboard/subscription?success=true",
          authenticatedUsersOnly: true,
        }),
        portal({
          returnUrl:
            process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000",
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionActive: async (payload) => {
            const customerId = payload.data.customerId;

            // Find the user in the database using the customerId
            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            // If the user is found, update their subscription tier to PRO
            if (user) {
              await updateUserTier(user.id, "PRO", "ACTIVE", payload.data.id);
            }
          },
          onSubscriptionCanceled: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (user) {
              await updateUserTier(user.id, "FREE", "CANCELED");
            }
          },
          onSubscriptionRevoked: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (user) {
              await updateUserTier(user.id, "FREE", "EXPIRED");
            }
          },
          onOrderPaid: async (payload) => {},
          onCustomerCreated: async (payload) => {
            const user = await prisma.user.findUnique({
              where: {
                email: payload.data.email ?? undefined,
              },
            });

            if (user) {
              await updatePolarCustomerId(user.id, payload.data.id);
            }
          },
        }),
      ],
    }),
  ],
});
