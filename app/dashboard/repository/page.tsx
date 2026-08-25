"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import RepositoryCard from "@/module/repository/components/repository-card";
import RepositoryPageShell from "@/module/repository/components/repository-page-shell";
import { RepositoryListSkeleton } from "@/module/repository/components/repository-skeleton";
import { useRepositories } from "@/module/repository/hooks/use-repositories";
import type { RepositoryListItem } from "@/module/repository/types";

const RepositoryPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRepositories();

  const [searchQuery, setSearchQuery] = useState("");
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(
    null
  );
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allRepositories = useMemo(
    () => data?.pages.flatMap((page) => page) ?? [],
    [data]
  );

  const filteredRepositories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return allRepositories;

    return allRepositories.filter(
      (repository) =>
        repository.name.toLowerCase().includes(query) ||
        repository.fullName.toLowerCase().includes(query)
    );
  }, [allRepositories, searchQuery]);

  const handleConnect = (repository: RepositoryListItem) => {};

  if (isLoading) {
    return (
      <RepositoryPageShell>
        <RepositoryListSkeleton />
      </RepositoryPageShell>
    );
  }

  if (isError) {
    return (
      <RepositoryPageShell>
        <div className="flex min-h-48 items-center justify-center rounded-lg border">
          <p className="text-muted-foreground text-sm">
            Failed to load repositories. Please try again later.
          </p>
        </div>
      </RepositoryPageShell>
    );
  }

  return (
    <RepositoryPageShell>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          placeholder="Search repositories"
          className="pl-8"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {filteredRepositories.length ? (
        <div className="grid gap-4">
          {filteredRepositories.map((repository) => (
            <RepositoryCard
              key={repository.id}
              repository={repository}
              isConnecting={localConnectingId === repository.id}
              onConnect={handleConnect}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 items-center justify-center rounded-lg border">
          <p className="text-muted-foreground text-sm">
            No repositories found.
          </p>
        </div>
      )}

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && <RepositoryListSkeleton />}
        {!hasNextPage && allRepositories.length > 0 && (
          <p className="text-muted-foreground text-center text-sm">
            No more repositories
          </p>
        )}
      </div>
    </RepositoryPageShell>
  );
};

export default RepositoryPage;
