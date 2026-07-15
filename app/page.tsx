import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import TrustIndicators from "@/components/sections/TrustIndicators";
import About from "@/components/sections/About";
import UnderstandingCupping from "@/components/sections/UnderstandingCupping";
import SessionProcess from "@/components/sections/SessionProcess";
import Services from "@/components/sections/Services";
import HygieneCare from "@/components/sections/HygieneCare";
import Certification from "@/components/sections/Certification";
import Booking from "@/components/sections/Booking";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { getPublicAvailableSlots, requestAppointment } from "@/lib/actions/appointments";
import { 
  getAdminServices, 
  getAdminFaqs, 
  getAdminCertifications, 
  getAdminSiteSettings 
} from "@/lib/actions/settings";

// These values are fetched from Supabase at request time and must not be
// resolved while Next.js is generating static pages during the production build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const slots = await getPublicAvailableSlots();
  
  // Retrieve dynamic site data from DB (Supabase / local JSON fallback)
  const services = await getAdminServices();
  const faqs = await getAdminFaqs();
  const certification = await getAdminCertifications();
  
  const siteSettingsRaw = await getAdminSiteSettings();
  const siteSettings = siteSettingsRaw ? {
    phone: siteSettingsRaw.phone || "+91 98765 43210",
    whatsapp: siteSettingsRaw.whatsapp || "919876543210",
    email: siteSettingsRaw.email || "asfan@example.com",
    location: siteSettingsRaw.location || "Shirur, Karnataka, India",
  } : undefined;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Single Page Content */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Trust Indicators */}
        <TrustIndicators />

        {/* 3. About Asfan */}
        <About />

        {/* 4. Understanding Cupping & Hijama */}
        <UnderstandingCupping />

        {/* 5. Session Process */}
        <SessionProcess />

        {/* 6. Services */}
        <Services services={services} />

        {/* 7. Hygiene and Care */}
        <HygieneCare />

        {/* 8. Certification */}
        <Certification certification={certification} />

        {/* 9. Availability and Booking (connected to live server data and actions) */}
        <Booking availableSlots={slots} onRequestBooking={requestAppointment} />

        {/* 10. FAQ */}
        <Faq faqs={faqs} />

        {/* 11. Contact */}
        <Contact contactInfo={siteSettings} />
      </main>

      {/* 12. Footer Section */}
      <Footer contactInfo={siteSettings} />
    </div>
  );
}
