/* This page is the home page of the app. It is the first page that users see when they visit the app. */


import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/navigation/top-nav";
import { HeroSection } from "@/components/home/hero";
import { HelpingKidsSection } from "@/components/home/helping-kids";
import { EndangeredTicker } from "@/components/home/endangered-ticker";
import { SignInCard } from "@/components/auth/sign-in-card";
import { HowItWorks } from "@/components/home/how-it-works";
import { ThreeStepsSection } from "@/components/home/three-steps";
import { Footer } from "@/components/home/footer";

export default async function Home() {
  let user: any = null;
  let authError: string | null = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (error) {
    authError =
      error instanceof Error
        ? error.message
        : "Unable to initialize Supabase. Check your environment variables.";
  }

  // Redirect authenticated users to dashboard
  if (user) {
    redirect("/dashboard");
  }

  const friendlyName =
    (user?.user_metadata as { student_name?: string; full_name?: string })?.student_name ??
    (user?.user_metadata as { full_name?: string })?.full_name ??
    user?.email;

  return (
    <main className="min-h-screen w-full bg-[#F9F7F0]">
      <TopNav isAuthed={false} userLabel={friendlyName} />

      <HeroSection isAuthed={false} />

      <EndangeredTicker />

      <HelpingKidsSection />

      <HowItWorks />

      <ThreeStepsSection />

      <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
        <section id="start" className="mt-10 grid gap-6 lg:grid-cols-2">
          {authError ? (
            <SetupNotice message={authError} />
          ) : (
            <SignInCard />
          )}
          <div className="rounded-[28px] border border-slate-200 bg-white/70 p-6">
            <h2 className="font-display text-2xl text-slate-900" id="students">
              Students
            </h2>
            <p className="mt-2 text-sm text-slate-700" id="teachers">
              Teachers can guide students through a math-powered endangered species report. Students
              can log in, pick an animal, and generate a printable one-pager.
            </p>
            <p className="mt-4 text-sm text-slate-700" id="about">
              This project is built with Bands of Courage to make sustainability education hands-on,
              creative, and measurable.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

const SetupNotice = ({ message }: { message: string }) => (
  <section className="rounded-[32px] border border-amber-200 bg-amber-50/70 p-6 text-amber-950 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
      Supabase setup needed
    </p>
    <h2 className="mt-2 font-display text-2xl">Can’t connect to Supabase yet.</h2>
    <p className="mt-3 text-sm text-amber-900/90">{message}</p>
    <div className="mt-4 space-y-2 rounded-3xl bg-white/70 p-4 text-sm text-amber-950">
      <p className="font-semibold">Check these first:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          Your Supabase project is <span className="font-semibold">not paused</span> in the dashboard.
        </li>
        <li>
          Your project has <span className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</span> and{" "}
          <span className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> set (see{" "}
          <span className="font-mono">env.example</span>).
        </li>
        <li>
          After updating env vars, restart the dev server.
        </li>
      </ul>
    </div>
  </section>
);
