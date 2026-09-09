"use client";

import Link from "next/link";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Clock, ExternalLink, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserReviews } from "@/module/review/actions";

const ReviewsPage = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      return await getUserReviews();
    },
  });

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold">Review History</h1>
        <p className="text-muted-foreground text-sm">
          View all AI code reviews
        </p>
      </div>

      {/*  */}
      {reviews?.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No reviews yet. Connect a repository and open a PR to{" "}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reviews?.map((review) => (
            <Card key={review.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">
                        {review.pullRequestTitle}
                      </CardTitle>
                      {review.reviewStatus === "completed" && (
                        <Badge variant={"default"} className="gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                        </Badge>
                      )}
                      {review.reviewStatus === "failed" && (
                        <Badge variant={"destructive"} className="gap-1">
                          <XCircle className="h-3 w-3" />
                        </Badge>
                      )}
                      {review.reviewStatus === "pending" && (
                        <Badge variant={"secondary"} className="gap-1">
                          <Clock className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {review.repository.fullName} • PR #
                      {review.pullRequestNumber}
                    </CardDescription>
                  </div>
                  {/* <Button variant={"ghost"} size={"icon"} asChild>
                    <Link
                      href={review.pullRequestUrl}
                      target="_blank"
                      rel="noonpener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button> */}
                  <Button value={"outline"} asChild>
                    <Link
                      href={review.pullRequestUrl}
                      target="_blank"
                      rel="noonpener noreferrer"
                    >
                      View Full Review on Github
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-muted-foreground text-[12px]">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-xs whitespace-pre-wrap">
                        {review.review.substring(0, 400)}...
                      </pre>
                    </div>
                  </div>
                  {/* <Button value={"outline"} asChild>
                    <Link
                      href={review.pullRequestUrl}
                      target="_blank"
                      rel="noonpener noreferrer"
                    >
                      View Full Review on Github
                    </Link>
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
