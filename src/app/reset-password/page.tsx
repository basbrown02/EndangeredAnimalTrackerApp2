"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handlePasswordReset = async (formData: FormData) => {
    startTransition(async () => {
      setMessage(null);
      setError(null);

      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");

      if (!password || password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match. Please try again.");
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();

        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) {
          setError(updateError.message);
          return;
        }

        setMessage("Password updated successfully! Redirecting to dashboard...");

        // Wait a moment then redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error(err);
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Reset Your Password
          </h1>
          <p className="text-sm text-slate-500">
            Enter your new password below.
          </p>
        </div>

        <form action={handlePasswordReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={6}
              placeholder="At least 6 characters"
              className="h-12 rounded-2xl border-slate-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={6}
              placeholder="Re-enter your password"
              className="h-12 rounded-2xl border-slate-200"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 py-6 text-base font-semibold text-white hover:bg-slate-800"
            disabled={pending}
          >
            {pending ? "Updating password..." : "Update Password"}
          </Button>
        </form>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-2xl bg-green-50 p-3 text-center text-sm text-green-600">
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}

