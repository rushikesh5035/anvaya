"use client";

import React, { useState } from "react";

import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { signIn } from "@/lib/auth-client";

const LoginUI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubLogin = async () => {
    setIsLoading(true);

    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("Login Error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="dark flex min-h-screen bg-linear-to-br from-black via-black to-zinc-900 text-white">
      <div className="flex flex-1 flex-col items-center justify-center px-12 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-12">
            <h2 className="mb-2 text-3xl font-bold">Welcome Back</h2>
            <p>Login using the following providers:</p>
          </div>

          {/* Github Login button */}
          <button
            onClick={handleGithubLogin}
            disabled={isLoading}
            className="mb-8 flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-semibold text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HugeiconsIcon icon={GithubIcon} />
            {isLoading ? "Signing in..." : "Github"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginUI;
