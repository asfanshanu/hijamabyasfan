import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("demo_admin_session")?.value === "true";

  if (!isDemo) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        redirect("/admin/login");
      }

      // Verify the authorized admin email configuration
      const adminEmail = process.env.ADMIN_EMAIL || "asfan@example.com";
      if (user.email !== adminEmail) {
        redirect("/admin/login?error=unauthorized");
      }
    } catch {
      redirect("/admin/login");
    }
  }

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden w-full">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Dynamic Subpages Panel */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#FAF9F5]">
        {children}
      </div>
    </div>
  );
}
