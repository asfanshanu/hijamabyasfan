"use server";

import { createClient, createPublicClient } from "@/lib/supabase/server";
import { isUsingDemo, readDemoDB, writeDemoDB } from "./db";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/error";

// --- SERVICES CRUD ---
export async function getAdminServices() {
  if (isUsingDemo()) {
    const db = readDemoDB();
    return db.services.sort((a, b) => a.display_order - b.display_order);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order");

    if (error) throw error;
    return data || [];
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Supabase fail in getAdminServices:", {
      message,
    });
    throw new Error(message);
  }
}

export async function upsertService(service: {
  id?: string;
  title: string;
  description: string;
  cta_label: string;
  display_order: number;
  is_active: boolean;
}) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    if (service.id) {
      // Update
      const idx = db.services.findIndex((s) => s.id === service.id);
      if (idx !== -1) {
        db.services[idx] = { ...db.services[idx], ...service };
      }
    } else {
      // Create
      const newService = {
        ...service,
        id: "srv-" + Math.random().toString(36).substr(2, 9),
      };
      db.services.push(newService);
    }
    writeDemoDB(db);
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    let res;
    if (service.id) {
      res = await supabase
        .from("services")
        .update({
          title: service.title,
          description: service.description,
          cta_label: service.cta_label,
          display_order: service.display_order,
          is_active: service.is_active,
        })
        .eq("id", service.id);
    } else {
      res = await supabase
        .from("services")
        .insert([service]);
    }

    if (res.error) throw res.error;
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in upsertService Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

export async function deleteService(id: string) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    db.services = db.services.filter((s) => s.id !== id);
    writeDemoDB(db);
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in deleteService Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

// --- FAQS CRUD ---
export async function getAdminFaqs() {
  if (isUsingDemo()) {
    const db = readDemoDB();
    return db.faqs.sort((a, b) => a.display_order - b.display_order);
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order");

    if (error) throw error;
    return data || [];
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Supabase fail in getAdminFaqs:", {
      message,
    });
    throw new Error(message);
  }
}

export async function upsertFaq(faq: {
  id?: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    if (faq.id) {
      // Update
      const idx = db.faqs.findIndex((f) => f.id === faq.id);
      if (idx !== -1) {
        db.faqs[idx] = { ...db.faqs[idx], ...faq };
      }
    } else {
      // Create
      const newFaq = {
        ...faq,
        id: "faq-" + Math.random().toString(36).substr(2, 9),
      };
      db.faqs.push(newFaq);
    }
    writeDemoDB(db);
    revalidatePath("/");
    revalidatePath("/admin/faq");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    let res;
    if (faq.id) {
      res = await supabase
        .from("faqs")
        .update({
          question: faq.question,
          answer: faq.answer,
          display_order: faq.display_order,
          is_active: faq.is_active,
        })
        .eq("id", faq.id);
    } else {
      res = await supabase
        .from("faqs")
        .insert([faq]);
    }

    if (res.error) throw res.error;
    revalidatePath("/");
    revalidatePath("/admin/faq");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in upsertFaq Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

export async function deleteFaq(id: string) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    db.faqs = db.faqs.filter((f) => f.id !== id);
    writeDemoDB(db);
    revalidatePath("/");
    revalidatePath("/admin/faq");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("faqs")
      .delete()
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/faq");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in deleteFaq Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

// --- CERTIFICATIONS ---
export async function getAdminCertifications() {
  if (isUsingDemo()) {
    const db = readDemoDB();
    return db.certifications[0] || null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Supabase fail in getAdminCertifications:", {
      message,
    });
    throw new Error(message);
  }
}

export async function updateCertification(cert: {
  id?: string;
  certificate_name: string;
  issuing_organisation: string;
  certification_year: number;
  certificate_image_url: string;
  is_active: boolean;
}) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    if (db.certifications.length > 0) {
      db.certifications[0] = { ...db.certifications[0], ...cert };
    } else {
      db.certifications.push({
        id: "cert-1",
        ...cert,
      });
    }
    writeDemoDB(db);
    revalidatePath("/");
    revalidatePath("/admin/certification");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    let res;
    if (cert.id) {
      res = await supabase
        .from("certifications")
        .update({
          certificate_name: cert.certificate_name,
          issuing_organisation: cert.issuing_organisation,
          certification_year: cert.certification_year,
          certificate_image_url: cert.certificate_image_url,
          is_active: cert.is_active,
        })
        .eq("id", cert.id);
    } else {
      res = await supabase
        .from("certifications")
        .insert([cert]);
    }

    if (res.error) throw res.error;
    revalidatePath("/");
    revalidatePath("/admin/certification");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in updateCertification Server Action:", {
      message,
    });
    return { success: false, message };
  }
}

// --- SITE SETTINGS ---
export async function getAdminSiteSettings() {
  if (isUsingDemo()) {
    const db = readDemoDB();
    const result: Record<string, string> = {};
    db.site_settings.forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");

    if (error) throw error;
    const result: Record<string, string> = {};
    (data || []).forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Supabase fail in getAdminSiteSettings:", {
      message,
    });
    throw new Error(message);
  }
}

export async function updateSiteSettings(settings: Record<string, string>) {
  if (isUsingDemo()) {
    const db = readDemoDB();
    Object.entries(settings).forEach(([key, value]) => {
      const idx = db.site_settings.findIndex((s) => s.key === key);
      if (idx !== -1) {
        db.site_settings[idx].value = value;
      } else {
        db.site_settings.push({ key, value });
      }
    });
    writeDemoDB(db);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const rows = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
    }));

    const { error } = await supabase
      .from("site_settings")
      .upsert(rows);

    if (error) throw error;
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err: unknown) {
    const message = getErrorMessage(err);
    console.error("Error in updateSiteSettings Server Action:", {
      message,
    });
    return { success: false, message };
  }
}
