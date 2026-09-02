"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  disconnectAllRepositories,
  disconnectRepository,
  getConnectedRepositories,
} from "@/module/settings/actions";
import { ConnectedRepositoryItem } from "@/module/settings/components/connected-repository-item";
import { DisconnectAllRepositoriesDialog } from "@/module/settings/components/disconnect-all-repositories-dialog";

const RepositoryList = () => {
  const queryClient = useQueryClient();

  const [disconnectAllOpen, setDisconnectAllOpen] = useState(false);
  const [disconnectingRepositoryId, setDisconnectingRepositoryId] = useState<
    string | null
  >(null);

  const { data: repositories, isLoading } = useQuery({
    queryKey: ["connected-repositories"],
    queryFn: getConnectedRepositories,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const invalidateRepositoryQueries = () => {
    queryClient.invalidateQueries({
      queryKey: ["connected-repositories"],
    });
    queryClient.invalidateQueries({ queryKey: ["user-repositories"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
  };

  const disconnectRepoMutation = useMutation({
    mutationFn: disconnectRepository,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      invalidateRepositoryQueries();
      toast.success(result.message);
    },
    onError: () => toast.error("Failed to disconnect repository"),
    onSettled: () => setDisconnectingRepositoryId(null),
  });

  const disconnectAllRepoMutation = useMutation({
    mutationFn: disconnectAllRepositories,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      invalidateRepositoryQueries();
      toast.success(`Disconnected ${result.count} repositories`);
      setDisconnectAllOpen(false);
    },
    onError: () => toast.error("Failed to disconnect repositories"),
  });

  const handleDisconnectRepository = (repositoryId: string) => {
    setDisconnectingRepositoryId(repositoryId);
    disconnectRepoMutation.mutate(repositoryId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>
            Manage your connected GitHub repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="bg-muted h-20 rounded" />
            <div className="bg-muted h-20 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>
              Manage your connected GitHub repositories
            </CardDescription>
          </div>
          {repositories && repositories.length > 0 && (
            <DisconnectAllRepositoriesDialog
              isOpen={disconnectAllOpen}
              isPending={disconnectAllRepoMutation.isPending}
              repositoryCount={repositories.length}
              onOpenChange={setDisconnectAllOpen}
              onConfirm={() => disconnectAllRepoMutation.mutate()}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!repositories || repositories.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <p>No repositories connected yet.</p>
            <p className="mt-2 text-sm">
              Connect repositories from the Repository page.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
            {repositories.map((repository) => (
              <ConnectedRepositoryItem
                key={repository.id}
                repository={repository}
                isPending={disconnectingRepositoryId === repository.id}
                onDisconnect={handleDisconnectRepository}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RepositoryList;
