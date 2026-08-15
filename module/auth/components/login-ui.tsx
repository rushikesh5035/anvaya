"use client";

import React, { useState } from "react";

import { GithubIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { signIn } from "@/lib/auth-client";

const LoginUI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const result = await signIn.social({
        provider: "github",
      });

      if (result?.error) {
        setLoginError("GitHub sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginError("GitHub sign-in failed. Please try again.");
    } finally {
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
          {loginError ? (
            <p className="mb-4 text-sm text-red-400" role="alert">
              {loginError}
            </p>
          ) : null}

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
