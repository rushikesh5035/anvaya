"use client";

import Link from "next/link";

import { ExternalLink, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ConnectedRepository } from "@/module/settings/types";

type ConnectedRepositoryItemProps = {
  repository: ConnectedRepository;
  isPending: boolean;
  onDisconnect: (repositoryId: string) => void;
};

export const ConnectedRepositoryItem = ({
  repository,
  isPending,
  onDisconnect,
}: ConnectedRepositoryItemProps) => {
  return (
    <div className="hover:bg-muted/50 flex min-h-32 flex-col justify-between rounded-lg border p-4 transition-colors">
      <div className="min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold break-all">
            {repository.fullName}
          </h3>
          <Link
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label={`Open ${repository.fullName} on GitHub`}
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-4 w-full justify-center"
            disabled={isPending}
          >
            <span>{isPending ? "Disconnecting..." : "Disconnect"}</span>
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Repository?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect <strong>{repository.fullName}</strong> and
              delete all associated AI reviews. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDisconnect(repository.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Disconnecting..." : "Disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
