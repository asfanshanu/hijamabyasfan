"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";

// Definition of Booking Schemas
const bookingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number starting with 6-9"),
  age: z.string().optional().refine(val => !val || (parseInt(val, 10) >= 12 && parseInt(val, 10) <= 100), {
    message: "Age must be between 12 and 100",
  }),
  sessionNote: z.string().max(300, "Notes must be under 300 characters").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export interface TimeSlot {
  id: string;
  appointment_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string;
  status: "available" | "reserved" | "booked" | "unavailable";
}

interface BookingProps {
  availableSlots?: TimeSlot[];
  onRequestBooking?: (values: BookingFormValues & { slotId: string }) => Promise<{ success: boolean; message?: string }>;
}

export default function Booking({ availableSlots = [], onRequestBooking }: BookingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1: Date & Time, 2: Patient Form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  // Mock slots for Phase 2 UI preview if database not connected
  const fallbackSlots: TimeSlot[] = [
    { id: "slot-1", appointment_date: formattedDate, start_time: "17:00:00", end_time: "18:00:00", status: "available" },
    { id: "slot-2", appointment_date: formattedDate, start_time: "18:00:00", end_time: "19:00:00", status: "available" },
    { id: "slot-3", appointment_date: formattedDate, start_time: "19:00:00", end_time: "20:00:00", status: "booked" },
    { id: "slot-4", appointment_date: formattedDate, start_time: "20:00:00", end_time: "21:00:00", status: "available" },
  ];

  const dateSlots = (availableSlots.length > 0 ? availableSlots : fallbackSlots).filter(slot => slot.appointment_date === formattedDate);

  const activeAvailableSlots = dateSlots.filter(slot => slot.status === "available");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      age: "",
      sessionNote: "",
    },
  });

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
    setStep(1);
  };

  const handleNextStep = () => {
    if (selectedSlotId) {
      setStep(2);
    }
  };

  const onFormSubmit = async (data: BookingFormValues) => {
    if (!selectedSlotId) return;
    setIsSubmitting(true);

    try {
      if (onRequestBooking) {
        const res = await onRequestBooking({ ...data, slotId: selectedSlotId });
        if (res.success) {
          setSuccessMessage(res.message || "Your appointment request has been received. Your appointment is confirmed only after approval.");
          reset();
          setSelectedSlotId(null);
          setStep(1);
        }
      } else {
        // Fallback simulate submission for preview
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setSuccessMessage("Your appointment request has been received. Your appointment is confirmed only after approval.");
        reset();
        setSelectedSlotId(null);
        setStep(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format TIME string (HH:MM:SS) to standard readable AM/PM format
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    let hr = parseInt(hours, 10);
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12;
    hr = hr ? hr : 12; // 0 should be 12
    return `${hr}:${minutes} ${ampm}`;
  };

  const selectedSlotInfo = dateSlots.find(s => s.id === selectedSlotId);

  return (
    <section id="availability" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
            Calendar & Booking
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
            Schedule a Session
          </h2>
          <p className="text-base text-foreground/80 leading-relaxed font-sans">
            Choose your date and time below to request a session. No user account is required to complete your booking.
          </p>
        </div>

        {/* Success Alert Dialog overlay/banner */}
        {successMessage && (
          <div className="max-w-3xl mx-auto mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">
                Request Submitted Successfully
              </h4>
              <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {successMessage}
              </p>
              <Button 
                variant="link" 
                className="text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 p-0 h-auto text-xs underline font-bold"
                onClick={() => setSuccessMessage(null)}
              >
                Book another appointment
              </Button>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-muted/20 border border-border/80 rounded-[2rem] p-6 md:p-10">
          
          {/* Step 1 Left Panel: Calendar Selection */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4">
            <h3 className="font-sans font-semibold text-base text-deep-olive dark:text-soft-sage flex items-center gap-2 self-start pl-2">
              <CalendarIcon className="h-5 w-5" />
              1. Select Appointment Date
            </h3>
            <div className="bg-background border border-border/80 rounded-2xl p-4 shadow-sm w-full flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                disabled={(date) => isBefore(startOfDay(date), startOfDay(new Date()))}
                className="w-full flex justify-center"
              />
            </div>
          </div>

          {/* Right Panel: Time Slot & Form Wizard */}
          <div className="lg:col-span-6 space-y-6">
            
            {step === 1 ? (
              <div className="space-y-6">
                <h3 className="font-sans font-semibold text-base text-deep-olive dark:text-soft-sage flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  2. Select Available Time Slot
                </h3>
                
                {selectedDate ? (
                  <div className="space-y-4">
                    <p className="text-xs text-foreground/70">
                      Showing availability for <strong className="text-deep-olive">{format(selectedDate, "EEEE, MMMM d, yyyy")}</strong>:
                    </p>
                    
                    {activeAvailableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {dateSlots.map((slot) => {
                          const isBooked = slot.status !== "available";
                          const isSelected = selectedSlotId === slot.id;
                          
                          return (
                            <button
                              key={slot.id}
                              disabled={isBooked}
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`py-4 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                                isBooked
                                  ? "bg-muted text-foreground/40 border-border/40 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-deep-olive text-warm-ivory border-deep-olive shadow-sm"
                                  : "bg-background text-foreground border-border hover:border-deep-olive hover:bg-muted/10"
                              }`}
                            >
                              <span>{formatTime(slot.start_time)}</span>
                              <span className="text-[10px] uppercase tracking-wider opacity-85">
                                {isBooked ? "Unavailable" : "Available"}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-xl bg-background border border-dashed border-border flex flex-col items-center justify-center space-y-3">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground/80">
                          No available time slots on this date.
                        </p>
                        <p className="text-xs text-foreground/60">
                          Please select another day on the calendar.
                        </p>
                      </div>
                    )}

                    {selectedSlotId && (
                      <Button 
                        onClick={handleNextStep}
                        className="w-full rounded-full py-6 mt-4 text-base font-semibold group flex items-center justify-center gap-2"
                      >
                        Provide Booking Details
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    )}

                  </div>
                ) : (
                  <p className="text-sm text-foreground/60 italic">Please select a date on the calendar first.</p>
                )}
              </div>
            ) : (
              // Step 2 Form Panel
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <h3 className="font-sans font-bold text-base text-deep-olive dark:text-soft-sage flex items-center gap-2">
                    <User className="h-5 w-5" />
                    3. Contact & Session Details
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-xs text-muted-gold font-bold hover:underline"
                  >
                    Change Time
                  </button>
                </div>

                <div className="bg-background rounded-xl border border-border/50 p-4 text-xs space-y-1 font-medium">
                  <p className="text-foreground/70">Selected Session:</p>
                  <p className="text-deep-olive dark:text-soft-sage text-sm font-semibold">
                    {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                    {selectedSlotInfo && ` @ ${formatTime(selectedSlotInfo.start_time)}`}
                  </p>
                </div>

                {/* Input Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your name"
                    className="rounded-xl h-11 bg-background"
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-xs font-bold text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Input Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="phoneNumber" className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Phone Number (WhatsApp)
                  </Label>
                  <Input
                    id="phoneNumber"
                    placeholder="10-digit mobile number"
                    type="tel"
                    className="rounded-xl h-11 bg-background"
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-xs font-bold text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Input Age */}
                <div className="space-y-1.5">
                  <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                    Age <span className="text-[10px] text-foreground/50 lowercase font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="age"
                    placeholder="Enter your age"
                    type="number"
                    className="rounded-xl h-11 bg-background"
                    {...register("age")}
                  />
                  {errors.age && (
                    <p className="text-xs font-bold text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.age.message}
                    </p>
                  )}
                </div>

                {/* Optional Note & Privacy Warning */}
                <div className="space-y-2">
                  <Label htmlFor="sessionNote" className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                    Session Note <span className="text-[10px] text-foreground/50 lowercase font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="sessionNote"
                    placeholder="Briefly mention session goals or comfort preferences..."
                    className="rounded-xl min-h-[80px] bg-background"
                    {...register("sessionNote")}
                  />
                  
                  {/* Privacy Notice Box */}
                  <div className="rounded-xl bg-amber-50/50 border border-amber-200/50 dark:bg-amber-950/10 dark:border-amber-900/20 p-3.5 flex gap-2.5 text-[11px] text-foreground/75 leading-normal">
                    <FileText className="h-4.5 w-4.5 shrink-0 text-amber-700/80 dark:text-amber-400" />
                    <p>
                      <strong>Privacy Notice:</strong> Please do not submit medical prescriptions, medical records, or government ID cards. We only collect details necessary for appointment scheduling.
                    </p>
                  </div>
                </div>

                {/* Submit Booking */}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full rounded-full py-6 text-base font-semibold"
                >
                  {isSubmitting ? "Submitting Request..." : "Request Appointment"}
                </Button>
              </form>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
