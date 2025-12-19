import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

type Props = {
  isAuthed: boolean;
  userLabel?: string | null;
};

export const TopNav = ({ isAuthed, userLabel }: Props) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Link href="/" className="flex items-center">
        <Image
          src="/BOClogo.png"
          alt="BANDS OF COURAGE"
          width={200}
          height={90}
          className="h-16 w-auto object-contain"
          priority
        />
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
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 md:flex">
            <a className="hover:text-slate-900" href="#students">
              Students
            </a>
            <a className="hover:text-slate-900" href="#teachers">
              Teachers
            </a>
            <a className="hover:text-slate-900" href="#about">
              About Us
            </a>
          </nav>

          <Button
            asChild
            className="rounded-full bg-[#C6F3AE] px-7 text-sm font-semibold text-slate-900 shadow-sm hover:bg-[#B7EDA0]"
          >
            <a href="#start">Sign Up</a>
          </Button>
        </div>
      )}
    </header>
  );
};

