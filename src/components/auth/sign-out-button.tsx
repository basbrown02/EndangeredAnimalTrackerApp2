"use client";

import { useTransition, ComponentProps } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Props = ComponentProps<typeof Button> & { label?: string };

export const SignOutButton = ({ label = "Sign out", ...props }: Props) => {
  const [pending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      window.location.replace("/");
    });
  };

  return (
    <Button
      variant="ghost"
      className="rounded-full bg-white/60 px-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
      disabled={pending}
      onClick={handleSignOut}
      {...props}
    >
      {pending ? "See you soon..." : label}
    </Button>
  );
};
