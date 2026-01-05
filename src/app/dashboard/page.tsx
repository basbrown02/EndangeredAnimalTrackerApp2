import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getUserProjects } from "@/server-actions/project-submissions";

export default async function DashboardPage() {
  let user: any = null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser();
    user = fetchedUser;
  } catch (error) {
    console.error("Auth error:", error);
  }

  // Redirect to home if not authenticated
  if (!user) {
    redirect("/");
  }

  const friendlyName =
    (user?.user_metadata as { student_name?: string; full_name?: string })
      ?.student_name ??
    (user?.user_metadata as { full_name?: string })?.full_name ??
    user?.email?.split("@")[0] ??
    "Explorer";

  // Fetch user's projects
  const projects = await getUserProjects();

  return (
    <DashboardContent
      userName={friendlyName}
      projects={projects}
      userEmail={user.email}
    />
  );
}



