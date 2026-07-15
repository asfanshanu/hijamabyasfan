import fs from "fs";
import path from "path";

const DEMO_DB_PATH = path.join(process.cwd(), "public", "demo_db.json");

export interface DemoDB {
  availability_slots: DemoAvailabilitySlot[];
  appointments: DemoAppointment[];
  services: DemoService[];
  faqs: DemoFaq[];
  certifications: DemoCertification[];
  site_settings: DemoSiteSetting[];
}

export interface DemoAvailabilitySlot {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface DemoAppointment {
  id: string;
  full_name: string;
  phone_number: string;
  age?: number;
  appointment_slot_id: string | null;
  session_note: string;
  status: string;
  admin_note: string;
  created_at: string;
}

export interface DemoService {
  id: string;
  title: string;
  description: string;
  cta_label: string;
  display_order: number;
  is_active: boolean;
}

export interface DemoFaq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export interface DemoCertification {
  id: string;
  certificate_name: string;
  issuing_organisation: string;
  certification_year: number;
  certificate_image_url: string;
  is_active: boolean;
}

export interface DemoSiteSetting {
  key: string;
  value: string;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

const DEFAULT_DB: DemoDB = {
  availability_slots: [
    // Pre-populate with some slots
    { id: "mock-slot-1", appointment_date: "2026-07-15", start_time: "17:00:00", end_time: "18:00:00", status: "available" },
    { id: "mock-slot-2", appointment_date: "2026-07-15", start_time: "18:00:00", end_time: "19:00:00", status: "available" },
    { id: "mock-slot-3", appointment_date: "2026-07-15", start_time: "19:00:00", end_time: "20:00:00", status: "booked" },
    { id: "mock-slot-4", appointment_date: "2026-07-16", start_time: "10:00:00", end_time: "11:00:00", status: "available" },
  ],
  appointments: [
    {
      id: "mock-appt-1",
      full_name: "Rahul Kumar",
      phone_number: "9876543210",
      age: 28,
      appointment_slot_id: "mock-slot-3",
      session_note: "Relief for shoulder stiffness",
      status: "confirmed",
      admin_note: "",
      created_at: "2026-07-12T00:00:00.000Z",
    }
  ],
  services: [
    {
      id: "1",
      title: "General Cupping Session",
      description: "An appointment-based cupping session with an initial conversation, session preparation, and aftercare guidance.",
      cta_label: "View Availability",
      display_order: 1,
      is_active: true,
    },
    {
      id: "2",
      title: "Selected Day Cupping Sessions",
      description: "Cupping appointments available on selected scheduled days, subject to availability.",
      cta_label: "Check Available Slots",
      display_order: 2,
      is_active: true,
    },
    {
      id: "3",
      title: "Pre-Session Enquiry",
      description: "Have questions before booking? Contact Asfan to understand the session process and booking requirements.",
      cta_label: "Ask a Question",
      display_order: 3,
      is_active: true,
    },
  ],
  faqs: [
    {
      id: "1",
      question: "What is cupping?",
      answer: "Cupping is a traditional practice where specialized cups are placed on specific parts of the skin. Using suction, the cups pull the skin and superficial muscle layers slightly upward, promoting localized blood circulation and releasing tension in the muscle tissues.",
      display_order: 1,
      is_active: true,
    },
    {
      id: "2",
      question: "How do I book an appointment?",
      answer: "You can book directly on this website. Simply scroll to the 'Availability' section, select an available date on the calendar, choose your preferred time slot, fill out the booking form, and click submit. You do not need to create an account to book.",
      display_order: 2,
      is_active: true,
    },
    {
      id: "3",
      question: "Is an appointment required?",
      answer: "Yes. To ensure a calm environment, proper hygiene preparation, and personal attention, all sessions are strictly appointment-based. Walk-ins are not accommodated.",
      display_order: 3,
      is_active: true,
    },
  ],
  certifications: [
    {
      id: "1",
      certificate_name: "Diploma in Cupping Therapy",
      issuing_organisation: "National Board of Vocational Training Education",
      certification_year: 2025,
      certificate_image_url: "/asfan_certificate.png",
      is_active: true,
    }
  ],
  site_settings: [
    { key: "phone", value: "+91 98765 43210" },
    { key: "whatsapp", value: "919876543210" },
    { key: "email", value: "asfan@example.com" },
    { key: "location", value: "Shirur, Karnataka, India" },
  ],
};

export function readDemoDB(): DemoDB {
  try {
    if (!fs.existsSync(DEMO_DB_PATH)) {
      writeDemoDB(DEFAULT_DB);
      return DEFAULT_DB;
    }
    const data = fs.readFileSync(DEMO_DB_PATH, "utf8");
    return JSON.parse(data) as DemoDB;
  } catch (error) {
    console.error("Error reading demo db:", error);
    return DEFAULT_DB;
  }
}

export function writeDemoDB(db: DemoDB) {
  try {
    const dir = path.dirname(DEMO_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DEMO_DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing demo db:", error);
  }
}

export function isUsingDemo(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return url.includes("placeholder") || !url;
}
