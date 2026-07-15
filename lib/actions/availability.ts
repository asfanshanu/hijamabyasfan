"use server";

import { createClient } from "@/lib/supabase/server";
import { isUsingDemo, readDemoDB, writeDemoDB } from "./db";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/error";

export async function getSlotsByDate(dateStr: string) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    return db.availability_slots.filter((s) => s.appointment_date === dateStr);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("appointment_date", dateStr)
      .order("start_time");

    if (error) throw new Error(error.message);
    return data || [];
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Supabase query error for getSlotsByDate:", {
      message,
    });
    throw new Error(message);
  }
}

export async function createAvailabilitySlot(dateStr: string, startTime: string, endTime: string) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    
    const formattedStart = startTime.includes(":") && startTime.split(":").length === 2 ? `${startTime}:00` : startTime;
    const formattedEnd = endTime.includes(":") && endTime.split(":").length === 2 ? `${endTime}:00` : endTime;

    const exists = db.availability_slots.some(
      (s) => s.appointment_date === dateStr && s.start_time === formattedStart
    );
    if (exists) {
      return { success: false, message: "A slot already exists at this start time." };
    }

    const newSlot = {
      id: "slot-" + Math.random().toString(36).substr(2, 9),
      appointment_date: dateStr,
      start_time: formattedStart,
      end_time: formattedEnd,
      status: "available",
    };

    db.availability_slots.push(newSlot);
    writeDemoDB(db);
    revalidatePath("/admin/availability");
    return { success: true, slot: newSlot };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("availability_slots")
      .insert([
        {
          appointment_date: dateStr,
          start_time: startTime,
          end_time: endTime,
          status: "available",
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "A slot already exists at this start time." };
      }
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/availability");
    revalidatePath("/");
    return { success: true, slot: data };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in createAvailabilitySlot Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

export async function deleteAvailabilitySlot(slotId: string) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    
    // Check if slot has confirmed or pending booking
    const attachedAppt = db.appointments.find(
      (a) => a.appointment_slot_id === slotId && ["pending", "confirmed"].includes(a.status)
    );

    if (attachedAppt) {
      return {
        success: false,
        message: `Cannot delete slot. It is linked to an active '${attachedAppt.status}' appointment for ${attachedAppt.full_name}.`,
      };
    }

    db.availability_slots = db.availability_slots.filter((s) => s.id !== slotId);
    db.appointments = db.appointments.map((a) => 
      a.appointment_slot_id === slotId ? { ...a, appointment_slot_id: null } : a
    );

    writeDemoDB(db);
    revalidatePath("/admin/availability");
    return { success: true };
  }

  try {
    const supabase = await createClient();

    // Check for active appointments
    const { data: apptCheck, error: checkError } = await supabase
      .from("appointments")
      .select("id, status, full_name")
      .eq("appointment_slot_id", slotId)
      .in("status", ["pending", "confirmed"]);

    if (checkError) {
      return { success: false, message: checkError.message };
    }

    if (apptCheck && apptCheck.length > 0) {
      const appt = apptCheck[0];
      return {
        success: false,
        message: `Cannot delete slot. It has an active '${appt.status}' appointment for ${appt.full_name}.`,
      };
    }

    // Release this slot ID reference on older cancelled/declined appointments
    await supabase
      .from("appointments")
      .update({ appointment_slot_id: null })
      .eq("appointment_slot_id", slotId);

    const { error } = await supabase
      .from("availability_slots")
      .delete()
      .eq("id", slotId);

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/availability");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in deleteAvailabilitySlot Server Action:", {
      message,
    });
    return { success: false, message };
  }
}
