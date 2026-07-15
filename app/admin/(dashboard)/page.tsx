"use client";

import { useState, useEffect, useCallback } from "react";
import { getAppointments, updateAppointmentStatus } from "@/lib/actions/appointments";
import { getSlotsByDate } from "@/lib/actions/availability";
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

interface SlotItem {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

interface AppointmentItem {
  id: string;
  full_name: string;
  phone_number: string;
  age: number | null;
  appointment_slot_id: string | null;
  session_note: string | null;
  status: "pending" | "confirmed" | "rescheduled" | "completed" | "cancelled" | "declined";
  admin_note: string | null;
  created_at: string;
  availability_slots: SlotItem | null;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Metrics
  const [metrics, setMetrics] = useState({
    todayAppts: 0,
    pendingReqs: 0,
    upcomingAppts: 0,
    availableSlotsCount: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const appts = await getAppointments();
      setAppointments(appts as AppointmentItem[]);

      const todayStr = format(new Date(), "yyyy-MM-dd");
      const todaySlots = await getSlotsByDate(todayStr);

      // Calculations
      const todayCount = appts.filter(
        (a) => 
          a.availability_slots?.appointment_date === todayStr &&
          ["confirmed", "rescheduled"].includes(a.status)
      ).length;

      const pendingCount = appts.filter((a) => a.status === "pending").length;

      const upcomingCount = appts.filter(
        (a) => 
          a.availability_slots && 
          new Date(a.availability_slots.appointment_date) >= new Date() &&
          ["confirmed", "rescheduled"].includes(a.status)
      ).length;

      const availSlotsCount = todaySlots.filter((s) => s.status === "available").length;

      setMetrics({
        todayAppts: todayCount,
        pendingReqs: pendingCount,
        upcomingAppts: upcomingCount,
        availableSlotsCount: availSlotsCount,
      });

    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Failed to load dashboard metrics."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchDashboardData(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchDashboardData]);

  const handleQuickApprove = async (id: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await updateAppointmentStatus(id, "confirmed");
      if (res.success) {
        setSuccessMsg("Appointment approved successfully.");
        fetchDashboardData();
      } else {
        setErrorMsg(res.message || "Could not approve appointment.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const handleQuickDecline = async (id: string) => {
    if (!confirm("Decline this appointment request?")) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await updateAppointmentStatus(id, "declined");
      if (res.success) {
        setSuccessMsg("Appointment declined successfully.");
        fetchDashboardData();
      } else {
        setErrorMsg(res.message || "Could not decline appointment.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const recentPending = appointments.filter((a) => a.status === "pending").slice(0, 3);

  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr = hours % 12 || 12;
    return `${hr}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-6 md:p-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-deep-olive">Welcome, Asfan</h1>
          <p className="text-sm text-foreground/70">
            Here is what is happening with your cupping practice today, {format(new Date(), "MMMM d, yyyy")}.
          </p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="group/button inline-flex shrink-0 items-center justify-center rounded-full border border-deep-olive/20 bg-background text-sm font-medium whitespace-nowrap transition-all outline-none select-none px-4 py-2 gap-2 text-deep-olive hover:bg-deep-olive/5"
        >
          View Live Site
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-2.5 text-xs font-bold text-destructive max-w-5xl">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-2.5 text-xs font-bold text-emerald-800 max-w-5xl">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl">
        
        {/* Metric 1 */}
        <div className="bg-background border border-border p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Today&apos;s Sessions</span>
            <h2 className="text-4xl font-serif text-deep-olive">{metrics.todayAppts}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-soft-sage/10 text-deep-olive flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-background border border-border p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pending Requests</span>
            <h2 className="text-4xl font-serif text-deep-olive">{metrics.pendingReqs}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-background border border-border p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Upcoming Sessions</span>
            <h2 className="text-4xl font-serif text-deep-olive">{metrics.upcomingAppts}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-deep-olive/10 text-deep-olive flex items-center justify-center">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-background border border-border p-6 rounded-3xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Open Slots (Today)</span>
            <h2 className="text-4xl font-serif text-deep-olive">{metrics.availableSlotsCount}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Main Panel Content: Pending Actions & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl">
        
        {/* Left Column: Recent Pending Requests */}
        <div className="lg:col-span-8 bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-2">
            <h3 className="font-sans font-bold text-base text-deep-olive flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-soft-sage" />
              Recent Pending Requests
            </h3>
            <Link href="/admin/appointments" className="text-xs text-muted-gold font-bold flex items-center gap-0.5 hover:underline">
              All Appointments
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-foreground/60 italic">Checking for new requests...</p>
          ) : recentPending.length > 0 ? (
            <div className="divide-y divide-border/60">
              {recentPending.map((appt) => (
                <div key={appt.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold font-sans text-foreground">{appt.full_name}</h4>
                    <p className="text-xs text-foreground/75">
                      {appt.availability_slots ? (
                        <>
                          {format(new Date(appt.availability_slots.appointment_date), "MMM d, yyyy")}
                          {` @ ${formatTime(appt.availability_slots.start_time)}`}
                        </>
                      ) : (
                        <span>No slot reference</span>
                      )}
                    </p>
                    {appt.session_note && (
                      <p className="text-[11px] text-foreground/60 italic max-w-md truncate">
                        &ldquo;{appt.session_note}&rdquo;
                      </p>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 shrink-0">
                    <Button 
                      size="xs" 
                      onClick={() => handleQuickApprove(appt.id)}
                      className="rounded-full bg-deep-olive text-warm-ivory text-xs px-3 h-8"
                    >
                      Approve
                    </Button>
                    <Button 
                      size="xs" 
                      variant="outline" 
                      onClick={() => handleQuickDecline(appt.id)}
                      className="rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 text-xs px-3 h-8"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border border-dashed border-border rounded-2xl flex flex-col items-center justify-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600/70" />
              <p className="text-sm font-semibold text-foreground/80">All caught up!</p>
              <p className="text-xs text-foreground/60">No pending appointment requests to review.</p>
            </div>
          )}
        </div>

        {/* Right Column: Quick Links & Safety Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-background border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-deep-olive border-b border-border/50 pb-2">
              Quick Shortcuts
            </h3>
            <div className="flex flex-col gap-2.5 text-xs font-semibold text-deep-olive">
              <Link href="/admin/availability" className="flex items-center justify-between p-3 bg-muted/10 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
                <span>Manage Availability Slots</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/admin/services" className="flex items-center justify-between p-3 bg-muted/10 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
                <span>Configure Services</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/admin/faq" className="flex items-center justify-between p-3 bg-muted/10 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
                <span>Edit FAQ Questions</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="bg-muted/10 border border-border/80 rounded-3xl p-6 space-y-3">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-gold flex items-center gap-1.5">
              <HelpCircle className="h-4.5 w-4.5" />
              Admin Guide
            </h3>
            <p className="text-xs text-foreground/75 leading-relaxed">
              When an appointment is <strong>Approved</strong>, the client&apos;s slot is locked as Booked. If you <strong>Decline</strong> or <strong>Cancel</strong>, the time slot is automatically released back to public availability.
            </p>
          </div>

        </div>

      </div>
      
    </div>
  );
}
