"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  getSlotsByDate, 
  createAvailabilitySlot, 
  deleteAvailabilitySlot 
} from "@/lib/actions/availability";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Trash2, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Info 
} from "lucide-react";
import { format } from "date-fns";
import { getErrorMessage } from "@/lib/utils";

interface SlotItem {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: "available" | "reserved" | "booked" | "unavailable";
}

export default function AdminAvailability() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<SlotItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form inputs
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("18:00");

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const fetchSlots = useCallback(async () => {
    if (!formattedDate) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getSlotsByDate(formattedDate);
      setSlots(data as SlotItem[]);
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Failed to load slots."));
    } finally {
      setLoading(false);
    }
  }, [formattedDate]);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchSlots(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchSlots]);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formattedDate) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate times
    if (startTime >= endTime) {
      setErrorMsg("End time must be after start time.");
      return;
    }

    try {
      const res = await createAvailabilitySlot(formattedDate, startTime, endTime);
      if (res.success) {
        setSuccessMsg("Availability slot created successfully.");
        fetchSlots();
      } else {
        setErrorMsg(res.message || "Could not create slot.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to delete this availability slot?")) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await deleteAvailabilitySlot(slotId);
      if (res.success) {
        setSuccessMsg("Slot deleted successfully.");
        fetchSlots();
      } else {
        setErrorMsg(res.message || "Could not delete slot.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  // Convert time string to standard format
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    const hr = hours % 12 || 12;
    return `${hr}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2 border-b border-border/60 pb-6">
        <h1 className="text-3xl font-serif text-deep-olive">Availability Management</h1>
        <p className="text-sm text-foreground/70">
          Create, view, and remove available booking slots for Asfan Shanu&apos;s therapy sessions.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-2.5 text-xs font-bold text-destructive max-w-4xl">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30 p-4 flex items-start gap-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 max-w-4xl">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl">
        
        {/* Left Side: Calendar Select */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-sans font-bold text-base text-deep-olive flex items-center gap-2">
            <CalendarIcon className="h-4.5 w-4.5" />
            1. Select Calendar Date
          </h2>
          <div className="bg-background border border-border rounded-2xl p-4 shadow-sm flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
            />
          </div>
        </div>

        {/* Right Side: Slot configuration */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section: Add Slot */}
          <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="font-sans font-bold text-base text-deep-olive flex items-center gap-2 border-b border-border/50 pb-2">
              <Plus className="h-5 w-5" />
              Add Time Slot for {selectedDate && format(selectedDate, "MMM d, yyyy")}
            </h2>

            <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <Label htmlFor="startTime" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="rounded-xl h-11 bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="endTime" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-xl h-11 bg-background"
                />
              </div>

              <Button type="submit" className="w-full rounded-full h-11 font-medium sm:col-span-2">
                Add Available Slot
              </Button>
            </form>
          </div>

          {/* Section: List Slots */}
          <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="font-sans font-bold text-base text-deep-olive flex items-center gap-2 border-b border-border/50 pb-2">
              <Clock className="h-5 w-5" />
              Manage Slots for {selectedDate && format(selectedDate, "MMMM d, yyyy")}
            </h2>

            {loading ? (
              <p className="text-sm text-foreground/60 italic">Updating slots list...</p>
            ) : slots.length > 0 ? (
              <div className="divide-y divide-border/60">
                {slots.map((slot) => {
                  const isBooked = slot.status === "booked";
                  
                  return (
                    <div 
                      key={slot.id} 
                      className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col space-y-1">
                        <span className="font-sans font-semibold text-foreground">
                          {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider w-fit px-2 py-0.5 rounded-full ${
                          isBooked 
                            ? "bg-rose-50 text-rose-700 border border-rose-100" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {slot.status}
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSlot(slot.id)}
                        disabled={isBooked}
                        className={`h-9 w-9 rounded-full ${
                          isBooked 
                            ? "text-foreground/30 cursor-not-allowed" 
                            : "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        }`}
                        title={isBooked ? "Booked slots cannot be deleted" : "Delete Slot"}
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-border rounded-2xl flex flex-col items-center justify-center space-y-2">
                <Info className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-sm font-medium text-foreground/75">
                  No slots registered for this date.
                </p>
                <p className="text-xs text-foreground/60">
                  Use the form above to add session hours.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
