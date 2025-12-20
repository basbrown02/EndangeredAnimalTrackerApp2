"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "signin" | "signup";

export const SignInCard = () => {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const setFriendlyFetchError = (error: unknown) => {
    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
      setMessage(
        "Couldn’t reach Supabase (network error). Check your NEXT_PUBLIC_SUPABASE_URL is correct and your Supabase project is not paused, then restart `npm run dev`.",
      );
      return;
    }

    if (error instanceof Error) {
      setMessage(error.message);
      return;
    }

    setMessage("Something went wrong. Please try again.");
  };

  const handleGoogle = async () => {
    try {
      setMessage(null);
      const origin =
        typeof window !== "undefined" ? window.location.origin : undefined;

      if (!origin) {
        setMessage("Missing browser origin. Please refresh and try again.");
        return;
      }

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/dashboard`,
        },
      });
    } catch (error) {
      setFriendlyFetchError(error);
    }
  };

  const handleEmailSubmit = async (formData: FormData) => {
    startTransition(async () => {
      setMessage(null);
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");
      const studentName = String(formData.get("studentName") ?? "").trim();

      if (!email || !password) {
        setMessage("Please enter both email and password.");
        return;
      }

      try {
        if (mode === "signup") {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                student_name: studentName || null,
              },
            },
          });

          if (error) {
            setMessage(error.message);
            return;
          }

          setMessage("Account created! Check your email to verify and log in.");
          setMode("signin");
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage("Welcome back! Redirecting...");

        // Redirect to dashboard after successful sign in
        router.push("/dashboard");
      } catch (error) {
        setFriendlyFetchError(error);
      }
    });
  };

  return (
    <motion.section
      layout
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-sky-100/80"
    >
      <div className="space-y-1 text-center">
        <p className="font-display text-2xl text-slate-900">Start EATing</p>
        <p className="text-sm text-slate-500">
          Sign up with Google or create a kid-friendly login.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 rounded-2xl border-slate-300 py-5 text-base font-medium"
          onClick={handleGoogle}
        >
          <span role="img" aria-hidden>
            🌎
          </span>
          Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span className="h-px flex-1 bg-slate-200" aria-hidden />
          or use email
          <span className="h-px flex-1 bg-slate-200" aria-hidden />
        </div>

        <form
          action={handleEmailSubmit}
          className="space-y-4"
          autoComplete="on"
        >
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="studentName">First name or nickname</Label>
              <Input
                id="studentName"
                name="studentName"
                placeholder="Koala Captain"
                className="h-11 rounded-2xl border-slate-200"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@email.com"
              className="h-11 rounded-2xl border-slate-200"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={6}
              placeholder="At least 6 characters"
              className="h-11 rounded-2xl border-slate-200"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 py-5 text-base font-semibold text-white"
            disabled={pending}
          >
            {pending
              ? "Thinking..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500">
          {mode === "signup" ? "Already joined?" : "Need an account?"}{" "}
          <button
            type="button"
            className="font-semibold text-slate-900 underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          >
            {mode === "signup" ? "Sign in" : "Create one"}
          </button>
        </p>

        {message && (
          <p className="rounded-2xl bg-slate-50 p-3 text-center text-sm text-slate-600">
            {message}
          </p>
        )}
      </div>
    </motion.section>
  );
};

