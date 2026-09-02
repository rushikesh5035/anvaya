"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserProfile, updateUserProfile } from "@/module/settings/actions";
import { USER_PROFILE_QUERY_KEY } from "@/module/settings/constants";

const ProfileForm = () => {
  const queryClient = useQueryClient();

  const [nameDraft, setNameDraft] = useState("");
  const [hasEditedName, setHasEditedName] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const name = hasEditedName ? nameDraft : (profile?.name ?? "");
  const email = profile?.email ?? "";

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,

    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setHasEditedName(false);
      setNameDraft("");
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
      toast.success("Profile updated successfully");
    },

    onError: () => toast.error("Failed to update profile"),
  });

  const isSubmitDisabled =
    updateMutation.isPending || !name.trim() || name.trim() === profile?.name;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateMutation.mutate({ name });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="bg-muted h-10 rounded"></div>
            <div className="bg-muted h-10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setHasEditedName(true);
                setNameDraft(e.target.value);
              }}
              disabled={updateMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              readOnly
              disabled
            />
          </div>
          <Button type="submit" disabled={isSubmitDisabled}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
