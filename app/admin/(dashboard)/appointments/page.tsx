"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getAppointments, 
  updateAppointmentStatus,
  getPublicAvailableSlots
} from "@/lib/actions/appointments";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CalendarCheck, 
  Phone, 
  User, 
  Clock, 
  FileText, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  CalendarClock
} from "lucide-react";
import { format } from "date-fns";
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

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [availableSlots, setAvailableSlots] = useState<SlotItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Status feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Note dialog edit
  const [selectedAppt, setSelectedAppt] = useState<AppointmentItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);

  // Reschedule dialog
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleSlotId, setRescheduleSlotId] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAppointments();
      setAppointments(data as AppointmentItem[]);
      
      const slots = await getPublicAvailableSlots();
      setAvailableSlots(slots as SlotItem[]);
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Failed to load appointments data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchData(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchData]);

  const handleStatusChange = async (
    apptId: string, 
    status: AppointmentItem["status"],
    adminNote?: string,
    newSlotId?: string
  ) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await updateAppointmentStatus(apptId, status, adminNote, newSlotId);
      if (res.success) {
        setSuccessMsg(`Appointment status updated to '${status}' successfully.`);
        fetchData();
      } else {
        setErrorMsg(res.message || "Could not update appointment.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const openNoteDialog = (appt: AppointmentItem) => {
    setSelectedAppt(appt);
    setAdminNoteInput(appt.admin_note || "");
    setNoteOpen(true);
  };

  const handleSaveNote = async () => {
    if (!selectedAppt) return;
    setNoteOpen(false);
    await handleStatusChange(selectedAppt.id, selectedAppt.status, adminNoteInput);
  };

  const openRescheduleDialog = (appt: AppointmentItem) => {
    setSelectedAppt(appt);
    setRescheduleSlotId("");
    setRescheduleOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedAppt || !rescheduleSlotId) return;
    setRescheduleOpen(false);
    await handleStatusChange(selectedAppt.id, "rescheduled", selectedAppt.admin_note || "", rescheduleSlotId);
  };

  // Helpers
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr = hours % 12 || 12;
    return `${hr}:${minutes} ${ampm}`;
  };

  const filteredAppts = appointments.filter((appt) => {
    const matchesStatus = filterStatus === "all" || appt.status === filterStatus;
    const matchesSearch = 
      appt.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.phone_number.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusClass = (status: AppointmentItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "confirmed":
      case "rescheduled":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-200";
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2 border-b border-border/60 pb-6">
        <h1 className="text-3xl font-serif text-deep-olive">Appointments Management</h1>
        <p className="text-sm text-foreground/70">
          Review patient booking requests, confirm dates, reschedule slots, or log admin session notes.
        </p>
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

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between max-w-5xl bg-background border border-border p-4 rounded-2xl shadow-sm">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-deep-olive font-sans"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex gap-2 items-center">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold font-sans">
            Status:
          </span>
          <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || "all")}>
            <SelectTrigger className="w-[180px] bg-background border-border rounded-xl h-10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Main Appointments Feed */}
      <div className="max-w-5xl space-y-6">
        {loading ? (
          <p className="text-sm text-foreground/60 italic">Refreshing database...</p>
        ) : filteredAppts.length > 0 ? (
          filteredAppts.map((appt) => (
            <div 
              key={appt.id}
              className="bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow duration-300"
            >
              {/* Profile Details Column */}
              <div className="space-y-4 md:max-w-[65%]">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-sans font-bold text-lg text-deep-olive flex items-center gap-1.5">
                    <User className="h-4.5 w-4.5 text-soft-sage" />
                    {appt.full_name}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusClass(appt.status)}`}>
                    {appt.status}
                  </span>
                  {appt.age && (
                    <span className="text-xs text-foreground/60 bg-muted/60 px-2 py-0.5 rounded-md font-medium">
                      Age: {appt.age}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-foreground/80 font-sans">
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{appt.phone_number}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {appt.availability_slots ? (
                        <>
                          {format(new Date(appt.availability_slots.appointment_date), "MMM d, yyyy")}
                          {` @ ${formatTime(appt.availability_slots.start_time)}`}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">No slot linked</span>
                      )}
                    </span>
                  </p>
                </div>

                {appt.session_note && (
                  <div className="bg-muted/10 border border-border/50 rounded-xl p-3 flex gap-2 items-start text-xs text-foreground/75 leading-relaxed font-sans">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>
                      <strong>Client Note:</strong> &ldquo;{appt.session_note}&rdquo;
                    </p>
                  </div>
                )}

                {appt.admin_note && (
                  <div className="bg-amber-50/20 border border-amber-200/40 rounded-xl p-3 flex gap-2 items-start text-xs text-amber-900/90 leading-relaxed font-sans">
                    <Edit3 className="h-4 w-4 text-amber-700/60 shrink-0 mt-0.5" />
                    <p>
                      <strong>Admin Note:</strong> {appt.admin_note}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons Column */}
              <div className="flex flex-row md:flex-col justify-end gap-2.5 shrink-0 self-end md:self-center">
                
                {/* Pending Actions */}
                {appt.status === "pending" && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(appt.id, "confirmed")}
                      className="rounded-full bg-deep-olive hover:bg-deep-olive/90 font-medium px-4"
                    >
                      Confirm
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openRescheduleDialog(appt)}
                      className="rounded-full border-deep-olive/20 text-deep-olive hover:bg-deep-olive/5 font-medium px-4"
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Decline this appointment request? The slot will be freed.")) {
                          handleStatusChange(appt.id, "declined");
                        }
                      }}
                      className="rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium px-4"
                    >
                      Decline
                    </Button>
                  </>
                )}

                {/* Confirmed / Rescheduled Actions */}
                {(appt.status === "confirmed" || appt.status === "rescheduled") && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={() => handleStatusChange(appt.id, "completed")}
                      className="rounded-full bg-deep-olive hover:bg-deep-olive/90 font-medium px-4"
                    >
                      Mark Completed
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openRescheduleDialog(appt)}
                      className="rounded-full border-deep-olive/20 text-deep-olive hover:bg-deep-olive/5 font-medium px-4"
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        if (confirm("Cancel this confirmed appointment? The slot will be freed.")) {
                          handleStatusChange(appt.id, "cancelled");
                        }
                      }}
                      className="rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-medium px-4"
                    >
                      Cancel
                    </Button>
                  </>
                )}

                {/* Always show Edit Notes button */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openNoteDialog(appt)}
                  className="rounded-full hover:bg-muted text-foreground/80 font-medium px-4"
                >
                  Edit Admin Notes
                </Button>

              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border border-dashed border-border rounded-3xl max-w-5xl bg-background flex flex-col items-center justify-center space-y-3">
            <CalendarCheck className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground/80">No appointments found matching filters.</p>
          </div>
        )}
      </div>

      {/* EDIT ADMIN NOTE MODAL */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="max-w-md bg-background border border-border rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-deep-olive">Edit Admin Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-foreground/75">
              Add custom notes visible only to the administrator. Perfect for summarizing session focus or patient feedback.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="adminNote" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Admin Note
              </Label>
              <Textarea
                id="adminNote"
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="Write observations..."
                className="rounded-xl min-h-[100px] bg-background"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => setNoteOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-full" onClick={handleSaveNote}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESCHEDULE MODAL */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="max-w-md bg-background border border-border rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-deep-olive flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-soft-sage" />
              Reschedule Appointment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-xs text-foreground/75">
              Select an alternative open slot from our calendar to move this session. The old slot will be freed.
            </p>

            {availableSlots.length > 0 ? (
              <div className="space-y-1.5">
                <Label htmlFor="rescheduleSlot" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Available Slots
                </Label>
                <Select value={rescheduleSlotId} onValueChange={(val) => setRescheduleSlotId(val || "")}>
                  <SelectTrigger className="w-full bg-background border-border rounded-xl h-11">
                    <SelectValue placeholder="Select date and hour" />
                  </SelectTrigger>
                  <SelectContent className="bg-background max-h-[220px] overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id} className="cursor-pointer">
                        {format(new Date(slot.appointment_date), "MMM d, yyyy")}
                        {` @ ${formatTime(slot.start_time)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-800">
                No other available time slots exist in the database. Please register new availability first.
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => setRescheduleOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="rounded-full" 
              onClick={handleRescheduleSubmit}
              disabled={!rescheduleSlotId}
            >
              Reschedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
