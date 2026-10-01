"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useQuery } from "@tanstack/react-query";
import { includes } from "better-auth";
import { Check, ExternalLink, Loader2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { checkout, customer } from "@/lib/auth-client";
import {
  getSubscriptionData,
  syncSubscriptionStatus,
} from "@/module/payment/actions";

const PLAN_FEATURES = {
  free: [
    { name: "Up to 3 repositories", included: true },
    { name: "Up to 5 reviews per repository", included: true },
    { name: "basic code reviews", included: true },
    { name: "Community support", included: true },
    { name: "Advanced analytics", included: false },
    { name: "Priority supports", included: false },
  ],
  pro: [
    { name: "Unlimited repositories", included: true },
    { name: "Unlimited reviews ", included: true },
    { name: "Advanced code reviews", included: true },
    { name: "Email support", included: true },
    { name: "Advanced analytics", included: true },
    { name: "Priority supports", included: true },
  ],
};

const SubscriptionPage = () => {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["subscription-data"],
    queryFn: getSubscriptionData,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (success === "true") {
      const sync = async () => {
        try {
          await syncSubscriptionStatus();
          refetch();
        } catch (error) {
          console.error("Failed to sync subscription on success return", error);
        }
      };
      sync();
    }
  }, [success, refetch]);

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground text-sm">
            Failed to load subscription data
          </p>
        </div>
        <Alert variant={"destructive"}>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load subscription data. Please try again.
            <Button
              variant={"outline"}
              size={"sm"}
              className="ml-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data?.user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground text-sm">
            Please sign in to view subscription plan
          </p>
        </div>
      </div>
    );
  }

  const currentTier = data.user.subscriptionTier as "FREE" | "PRO";
  const isPro = currentTier === "PRO";
  const isActive = data.user.subscriptionStatus === "ACTIVE";

  const handleSync = async () => {
    try {
      setSyncLoading(true);
      const result = await syncSubscriptionStatus();
      if (result?.success) {
        toast.success("Subscription status updated");
        refetch();
      } else {
        toast.error("Failed to sync subscription");
      }
    } catch (error) {
      console.error("Failed to sync subscription", error);
      toast.error("Failed to sync subscription");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      await customer.portal();
    } catch (error) {
      console.error("Failed to open portal", error);
      setPortalLoading(false);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setCheckoutLoading(true);

      await checkout({
        slug: "pro",
      });
    } catch (error) {
      console.error("Failed to initiate checkout", error);
      setCheckoutLoading(false);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Subscription</h1>
          <p className="text-muted-foreground text-sm">
            View all AI code reviews
          </p>
        </div>

        <Button
          variant={"outline"}
          size={"sm"}
          onClick={handleSync}
          disabled={syncLoading}
        >
          {syncLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Sync Status
        </Button>
      </div>

      {success === "true" && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your subscription has been updated successfully. Changes many take a
            few moments to reflect.
          </AlertDescription>
        </Alert>
      )}

      {/* current usage */}
      {data.limits && (
        <Card>
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
            <CardDescription>
              Your current plan limits and usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Repositories</span>
                  <Badge
                    variant={
                      data.limits.repositories.canAdd
                        ? "default"
                        : "destructive"
                    }
                  >
                    {data.limits.repositories.current} /{" "}
                    {data.limits.repositories.limit ?? "∞"}
                  </Badge>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className={`h-full ${data.limits.repositories.canAdd ? "bg-primary" : "bg-destructive"}`}
                    style={{
                      width: data.limits.repositories.limit
                        ? `${Math.min((data.limits.repositories.current / data.limits.repositories.limit) * 100, 100)}
                      % `
                        : "0%",
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Reviews per Repository
                  </span>
                  <Badge variant={"outline"}>
                    {isPro ? "Unlimited" : "5 per repo"}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">
                  {isPro
                    ? "No limits no reviews"
                    : "Free tier allows 5 reviews per repository"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Free plan */}
        <Card className={!isPro ? "ring-primary ring-2" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
              </div>
              {!isPro && <Badge className="ml-2">Current Plan</Badge>}
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {PLAN_FEATURES.free.map((feature) => (
                <div key={feature.name} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="text-primary h-4 w-4 shrink-0" />
                  ) : (
                    <X className="text-muted-foreground h-4 w-4 shrink-0" />
                  )}
                  <span
                    className={feature.included ? "" : "text-muted-foreground"}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full" variant={"outline"} disabled>
              {!isPro ? "Current Plan" : "Downgrade"}
            </Button>
          </CardContent>
        </Card>

        {/* Pro plan */}
        <Card className={isPro ? "ring-primary ring-2" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For professional developers</CardDescription>
              </div>
              {isPro && <Badge className="ml-2">Current Plan</Badge>}
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$15</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {PLAN_FEATURES.pro.map((feature) => (
                <div key={feature.name} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="text-primary h-4 w-4 shrink-0" />
                  ) : (
                    <X className="text-muted-foreground h-4 w-4 shrink-0" />
                  )}
                  <span
                    className={feature.included ? "" : "text-muted-foreground"}
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
            {isPro && isActive ? (
              <Button
                className="w-full"
                variant={"outline"}
                disabled={portalLoading}
                onClick={handleManageSubscription}
              >
                {portalLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening Portal...
                  </>
                ) : (
                  <>
                    Manage Subscription
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="w-full"
                disabled={checkoutLoading}
                onClick={handleUpgrade}
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Checkout...
                  </>
                ) : (
                  "Upgrade to Pro"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPage;
