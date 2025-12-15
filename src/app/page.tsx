/* This page is the home page of the app. It is the first page that users see when they visit the app. */


import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TopNav } from "@/components/navigation/top-nav";
import { HeroSection } from "@/components/home/hero";
import { SignInCard } from "@/components/auth/sign-in-card";
import { SpeciesShowcase } from "@/components/species/species-showcase";
import { HowItWorks } from "@/components/home/how-it-works";
import { MyProjects } from "@/components/home/my-projects";
import { getUserProjects } from "@/server-actions/project-submissions";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const friendlyName =
    (user?.user_metadata as { student_name?: string; full_name?: string })?.student_name ??
    (user?.user_metadata as { full_name?: string })?.full_name ??
    user?.email;

  // Fetch user's projects if logged in
  const projects = user ? await getUserProjects() : [];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-2 lg:px-6">
      <TopNav isAuthed={Boolean(user)} userLabel={friendlyName} />

      <section className="grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
        <HeroSection isAuthed={Boolean(user)} />
        {user ? <QuickStartCard name={friendlyName} /> : <div id="start"><SignInCard /></div>}
      </section>

      {user ? (
        <>
          <MyProjects projects={projects} />
          <SpeciesShowcase />
        </>
      ) : (
        <HowItWorks />
      )}
    </main>
  );
}

const QuickStartCard = ({ name }: { name?: string | null }) => (
  <section className="flex flex-col gap-4 rounded-[32px] border border-slate-100 bg-white/90 p-6 shadow-lg shadow-slate-100/70">
    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
      Ready, researcher!
    </p>
    <h2 className="font-display text-3xl text-slate-900">
      {name ? `${name},` : "Explorer,"} pick an animal to begin.
    </h2>
    <p className="text-sm text-slate-600">
      We already saved your progress. Choose a mission below, fill in the maths,
      and we’ll build your printable project.
    </p>
    <div className="space-y-3 rounded-3xl bg-slate-50/80 p-4 text-sm text-slate-600">
      <p>✅ Step 1: Log in</p>
      <p>⏱️ Step 2: Pick a species</p>
      <p>🖨️ Step 3: Download your project</p>
    </div>
  </section>
);
