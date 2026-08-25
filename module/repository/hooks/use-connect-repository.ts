"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { connectRepository } from "@/module/repository/actions";
import { REPOSITORIES_QUERY_KEY } from "@/module/repository/constants";
import type { ConnectRepositoryInput } from "@/module/repository/types";

export const useConnectRepository = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ConnectRepositoryInput) =>
      connectRepository(input),

    onSuccess: (result) => {
      toast.success(
        result.alreadyConnected
          ? "Repository is already connected"
          : "Repository connected successfully"
      );
      queryClient.invalidateQueries({ queryKey: REPOSITORIES_QUERY_KEY });
    },

    onError: (error) => {
      console.error("Error connecting repository:", error);
      toast.error("Failed to connect repository");
    },
  });
};
