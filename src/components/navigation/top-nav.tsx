import Link from "next/link";
import { Star } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

type Props = {
  isAuthed: boolean;
  userLabel?: string | null;
};

export const TopNav = ({ isAuthed, userLabel }: Props) => {
  return (
    <header className="flex items-center justify-between gap-4 py-6">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-3xl">
          <span role="img" aria-hidden>
            🧭
          </span>
        </div>
        <div>
          <p className="font-display text-2xl leading-none text-slate-900">
            EAT Lab
          </p>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Endangered Animals Tracker
          </p>
        </div>
      </Link>

      {isAuthed ? (
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Star className="h-4 w-4 text-amber-400" />
          <span className="hidden sm:inline">
            {userLabel ? `Hi ${userLabel}` : "Ready to explore?"}
          </span>
          <SignOutButton />
        </div>
      ) : (
        <Button
          asChild
          className="rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <a href="#start">Log in</a>
        </Button>
      )}
    </header>
  );
};

