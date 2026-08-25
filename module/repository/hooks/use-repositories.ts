"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getUserRepositories } from "@/module/repository/actions";
import {
  REPOSITORIES_PAGE_SIZE,
  REPOSITORIES_QUERY_KEY,
} from "@/module/repository/constants";

export const useRepositories = () => {
  return useInfiniteQuery({
    queryKey: REPOSITORIES_QUERY_KEY,
    queryFn: async ({ pageParam = 1 }) =>
      getUserRepositories(pageParam, REPOSITORIES_PAGE_SIZE),

    // this function is used to get the next page param value for infinite scrolling
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < REPOSITORIES_PAGE_SIZE) return undefined;

      return allPages.length + 1; // return next page no to fecth
    },
    initialPageParam: 1,
  });
};
