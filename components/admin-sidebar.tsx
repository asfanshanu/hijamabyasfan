"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  CalendarClock, 
  ClipboardList, 
  HelpCircle, 
  Award, 
  Settings, 
  LogOut,
  User
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
    { label: "Availability", href: "/admin/availability", icon: CalendarClock },
    { label: "Services", href: "/admin/services", icon: ClipboardList },
    { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { label: "Certification", href: "/admin/certification", icon: Award },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    // Check if demo cookie session is present and clear it
    if (document.cookie.includes("demo_admin_session=true")) {
      document.cookie = "demo_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      router.push("/admin/login");
      router.refresh();
      return;
    }

    if (!hasSupabaseConfig) {
      router.push("/admin/login");
      router.refresh();
      return;
    }

    const { error } = await createClient().auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-deep-olive text-warm-ivory flex flex-col justify-between h-full border-r border-deep-olive/80">
      <div className="flex flex-col">
        {/* Brand header */}
        <div className="p-6 border-b border-warm-ivory/10">
          <Link href="/admin" className="flex flex-col select-none">
            <span className="font-serif text-xl font-bold tracking-tight text-warm-ivory">
              Hijama by Shanu
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-soft-sage font-sans font-medium">
              Admin Workspace
            </span>
          </Link>
        </div>

        {/* Sidebar user profile brief */}
        <div className="p-4 mx-4 my-3 bg-warm-ivory/5 border border-warm-ivory/10 rounded-2xl flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-soft-sage text-deep-olive flex items-center justify-center font-bold">
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-warm-ivory leading-none">Asfan Shanu</span>
            <span className="text-[9px] uppercase tracking-wider text-soft-sage mt-0.5">Administrator</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 py-2 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-warm-ivory text-deep-olive font-semibold shadow-sm"
                    : "text-warm-ivory/80 hover:text-warm-ivory hover:bg-warm-ivory/10"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-deep-olive" : "text-soft-sage"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="p-4 border-t border-warm-ivory/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-300 hover:text-red-100 hover:bg-red-950/20 rounded-xl transition-colors text-left"
        >
          <LogOut className="h-4.5 w-4.5 text-red-300" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
