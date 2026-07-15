"use server";

import { createClient, createPublicClient } from "@/lib/supabase/server";
import { isUsingDemo, readDemoDB, writeDemoDB } from "./db";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/error";

export async function requestAppointment(data: {
  fullName: string;
  phoneNumber: string;
  age?: number | string;
  slotId: string;
  sessionNote?: string;
}) {
  const ageVal = data.age ? parseInt(String(data.age), 10) : undefined;

  if (isUsingDemo()) {
    const db = readDemoDB();

    const slotIndex = db.availability_slots.findIndex((s) => s.id === data.slotId);
    if (slotIndex === -1) {
      return { success: false, message: "The selected time slot does not exist." };
    }

    const slot = db.availability_slots[slotIndex];
    if (slot.status !== "available") {
      return { success: false, message: "This slot is no longer available. Please choose another slot." };
    }

    const exists = db.appointments.some((a) => a.appointment_slot_id === data.slotId);
    if (exists) {
      return { success: false, message: "This time slot has already been requested." };
    }

    const newAppt = {
      id: "appt-" + Math.random().toString(36).substr(2, 9),
      full_name: data.fullName,
      phone_number: data.phoneNumber,
      age: ageVal,
      appointment_slot_id: data.slotId,
      session_note: data.sessionNote || "",
      status: "pending",
      admin_note: "",
      created_at: new Date().toISOString(),
    };

    db.availability_slots[slotIndex].status = "reserved";
    db.appointments.push(newAppt);
    
    writeDemoDB(db);
    revalidatePath("/admin/appointments");
    return { 
      success: true, 
      message: "Your appointment request has been received. Your appointment is confirmed only after approval." 
    };
  }

  try {
    const supabase = await createClient();

    // Check slot availability first
    const { data: slot, error: slotError } = await supabase
      .from("availability_slots")
      .select("status")
      .eq("id", data.slotId)
      .single();

    if (slotError || !slot) {
      return { success: false, message: "Selected availability slot not found." };
    }

    if (slot.status !== "available") {
      return { success: false, message: "This time slot is no longer available." };
    }

    // Insert the appointment
    const { error: insertError } = await supabase
      .from("appointments")
      .insert([
        {
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          age: ageVal,
          appointment_slot_id: data.slotId,
          session_note: data.sessionNote,
          status: "pending",
        },
      ]);

    if (insertError) {
      if (insertError.code === "23505") {
        return { success: false, message: "This slot has already been requested." };
      }
      return { success: false, message: insertError.message };
    }

    // Lock the slot to reserved
    await supabase
      .from("availability_slots")
      .update({ status: "reserved" })
      .eq("id", data.slotId);

    revalidatePath("/admin/appointments");
    revalidatePath("/");
    return { 
      success: true, 
      message: "Your appointment request has been received. Your appointment is confirmed only after approval." 
    };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in requestAppointment Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

export async function getPublicAvailableSlots() {
  if (isUsingDemo()) {
    const db = readDemoDB();
    return db.availability_slots.filter((s) => s.status === "available");
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("status", "available")
      .order("appointment_date")
      .order("start_time");

    if (error) throw error;
    return data || [];
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Supabase failed querying public available slots:", {
      message,
    });
    throw new Error(message);
  }
}

export async function getAppointments() {
  if (isUsingDemo()) {
    const db = readDemoDB();
    // Join manually
    return db.appointments.map(appt => {
      const slot = db.availability_slots.find(s => s.id === appt.appointment_slot_id);
      return {
        ...appt,
        availability_slots: slot || null
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointments")
      .select("*, availability_slots(*)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error retrieving appointments:", {
      message,
    });
    throw new Error(message);
  }
}

export async function updateAppointmentStatus(
  apptId: string, 
  status: "pending" | "confirmed" | "rescheduled" | "completed" | "cancelled" | "declined",
  adminNote?: string,
  newSlotId?: string
) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    const apptIndex = db.appointments.findIndex(a => a.id === apptId);
    
    if (apptIndex === -1) {
      return { success: false, message: "Appointment not found." };
    }

    const appt = db.appointments[apptIndex];
    const oldSlotId = appt.appointment_slot_id;

    // Handle rescheduling logic
    if (status === "rescheduled" && newSlotId) {
      // 1. Release old slot
      if (oldSlotId) {
        const oldSlotIdx = db.availability_slots.findIndex(s => s.id === oldSlotId);
        if (oldSlotIdx !== -1) db.availability_slots[oldSlotIdx].status = "available";
      }

      // 2. Lock new slot
      const newSlotIdx = db.availability_slots.findIndex(s => s.id === newSlotId);
      if (newSlotIdx === -1) {
        return { success: false, message: "The newly selected slot does not exist." };
      }
      db.availability_slots[newSlotIdx].status = "booked";
      
      // 3. Update appointment
      appt.appointment_slot_id = newSlotId;
    } else if (status === "confirmed") {
      if (oldSlotId) {
        const slotIdx = db.availability_slots.findIndex(s => s.id === oldSlotId);
        if (slotIdx !== -1) db.availability_slots[slotIdx].status = "booked";
      }
    } else if (status === "declined" || status === "cancelled") {
      if (oldSlotId) {
        const slotIdx = db.availability_slots.findIndex(s => s.id === oldSlotId);
        if (slotIdx !== -1) db.availability_slots[slotIdx].status = "available";
      }
    }

    appt.status = status;
    if (adminNote !== undefined) {
      appt.admin_note = adminNote;
    }
    
    writeDemoDB(db);
    revalidatePath("/admin/appointments");
    return { success: true };
  }

  try {
    const supabase = await createClient();

    // Check old slot reference first for rescheduling release
    const { data: currentAppt, error: apptError } = await supabase
      .from("appointments")
      .select("appointment_slot_id")
      .eq("id", apptId)
      .single();

    if (apptError || !currentAppt) {
      return { success: false, message: "Appointment not found in database." };
    }

    const oldSlotId = currentAppt.appointment_slot_id;

    if (status === "rescheduled" && newSlotId) {
      // 1. Release old slot
      if (oldSlotId) {
        await supabase
          .from("availability_slots")
          .update({ status: "available" })
          .eq("id", oldSlotId);
      }

      // 2. Lock new slot
      await supabase
        .from("availability_slots")
        .update({ status: "booked" })
        .eq("id", newSlotId);

      // 3. Update appointment to new slot and set status
      const { error } = await supabase
        .from("appointments")
        .update({
          appointment_slot_id: newSlotId,
          status: "rescheduled",
          admin_note: adminNote,
        })
        .eq("id", apptId);

      if (error) return { success: false, message: error.message };
    } else {
      // Standard status updates. Note: RLS & triggers handles slot status sync for confirm/decline/cancel.
      const { error } = await supabase
        .from("appointments")
        .update({
          status,
          admin_note: adminNote,
        })
        .eq("id", apptId);

      if (error) return { success: false, message: error.message };

      // Manual fallback slot sync if trigger not working/deployed
      if (status === "confirmed" && oldSlotId) {
        await supabase.from("availability_slots").update({ status: "booked" }).eq("id", oldSlotId);
      } else if ((status === "declined" || status === "cancelled") && oldSlotId) {
        await supabase.from("availability_slots").update({ status: "available" }).eq("id", oldSlotId);
      }
    }

    revalidatePath("/admin/appointments");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in updateAppointmentStatus Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

