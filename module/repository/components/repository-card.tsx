import Link from "next/link";

import { ExternalLink, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RepositoryListItem } from "../types";

const RepositoryCard = ({
  repository,
  isConnecting,
  onConnect,
}: {
  repository: RepositoryListItem;
  isConnecting: boolean;
  onConnect: (repository: RepositoryListItem) => void;
}) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg">{repository.name}</CardTitle>
              <Badge variant="outline">
                {repository.language || "Unknown"}
              </Badge>
              {repository.isConnected && (
                <Badge variant="secondary">Connected</Badge>
              )}
            </div>
            <CardDescription>
              {repository.description || "No description provided."}
            </CardDescription>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge>{repository.isPrivate ? "Private" : "Public"}</Badge>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${repository.fullName} on GitHub`}
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              onClick={() => onConnect(repository)}
              disabled={isConnecting || repository.isConnected}
              variant={repository.isConnected ? "outline" : "default"}
            >
              {isConnecting
                ? "Connecting..."
                : repository.isConnected
                  ? "Connected"
                  : "Connect"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1">
          <Star className="fill-primary text-primary h-4 w-4" />
          <span className="text-sm font-medium">{repository.stars}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;
