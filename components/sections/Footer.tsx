import { Phone, MessageCircle, Mail } from "lucide-react";

const CashLogo = () => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-sans tracking-wider uppercase select-none">
    <svg className="h-3.5 w-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
    <span>Cash</span>
  </div>
);

const PhonePeLogo = () => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5f259f]/10 border border-[#5f259f]/20 text-[#a482e6] text-[10px] font-bold font-sans tracking-wider uppercase select-none">
    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#5f259f" />
      <path d="M12 4a3 3 0 0 0-3 3v3H7v2h2v6h2v-6h3c1.66 0 3-1.34 3-3V7a3 3 0 0 0-3-3zm1 6h-2V7a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1z" fill="white" />
    </svg>
    <span>PhonePe</span>
  </div>
);

const GPayLogo = () => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4285F4]/10 border border-[#4285F4]/20 text-[#679bf1] text-[10px] font-bold font-sans tracking-wider uppercase select-none">
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M22.5 12c0-.6-.1-1.2-.2-1.7H12v3.4h5.9c-.3 1.3-1 2.4-2.1 3.1v2.6h3.4C21.2 17.6 22.5 15 22.5 12z" fill="#4285F4" />
      <path d="M12 22.5c2.8 0 5.2-.9 7-2.6l-3.4-2.6c-1 .6-2.2 1-3.6 1-2.8 0-5.2-1.9-6-4.5H2.5v2.7c1.8 3.5 5.4 6 9.5 6z" fill="#34A853" />
      <path d="M6 13.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.5H2.5C1.8 8.9 1.5 10.4 1.5 12s.3 3.1 1 4.5L6 13.8z" fill="#FBBC05" />
      <path d="M12 5.7c1.5 0 2.9.5 4 1.5l3-3C17.2 2.4 14.8 1.5 12 1.5 7.9 1.5 4.3 4 2.5 7.5L6 10.2c.8-2.6 3.2-4.5 6-4.5z" fill="#EA4335" />
    </svg>
    <span>GPay</span>
  </div>
);

const PaytmLogo = () => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00b9f5]/10 border border-[#00b9f5]/20 text-[#47c9f5] text-[10px] font-bold font-sans tracking-wider uppercase select-none">
    <svg className="h-3.5 w-9" viewBox="0 0 38 12" fill="none">
      <text x="0" y="10" fill="#002E6E" fontFamily="sans-serif" fontSize="10" fontWeight="bold">pay</text>
      <text x="18" y="10" fill="#00B9F5" fontFamily="sans-serif" fontSize="10" fontWeight="bold">tm</text>
    </svg>
  </div>
);

interface ContactDetails {
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
}

interface FooterProps {
  contactInfo?: ContactDetails;
}

export default function Footer({ contactInfo }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const info = contactInfo || {
    phone: "",
    whatsapp: "",
    email: "",
    location: "",
  };

  return (
    <footer className="bg-deep-olive text-warm-ivory py-16 mt-auto">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 border-b border-warm-ivory/10 pb-12">

          {/* Column Left: Brand info */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-warm-ivory">
              Hijama by Shanu
            </h3>
            <p className="text-sm uppercase tracking-[0.2em] text-soft-sage">
              Traditional Care. Personal Attention.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href={`tel:${info.phone}`}
                className="p-2 rounded-full border border-warm-ivory/20 hover:border-warm-ivory hover:bg-warm-ivory/10 transition-colors"
                aria-label="Phone Call"
              >
                <Phone className="h-5 w-5 text-soft-sage hover:text-warm-ivory" />
              </a>
              <a
                href={`https://wa.me/${info.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-warm-ivory/20 hover:border-warm-ivory hover:bg-warm-ivory/10 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-soft-sage hover:text-warm-ivory" />
              </a>
              <a
                href={`mailto:${info.email}`}
                className="p-2 rounded-full border border-warm-ivory/20 hover:border-warm-ivory hover:bg-warm-ivory/10 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-soft-sage hover:text-warm-ivory" />
              </a>
            </div>
          </div>

          {/* Column Middle: Links */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-soft-sage">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm font-medium text-warm-ivory/80">
              <a href="#home" className="hover:text-warm-ivory transition-colors">Home</a>
              <a href="#about" className="hover:text-warm-ivory transition-colors">About</a>
              <a href="#cupping" className="hover:text-warm-ivory transition-colors">Cupping</a>
              <a href="#services" className="hover:text-warm-ivory transition-colors">Services</a>
              <a href="#faq" className="hover:text-warm-ivory transition-colors">FAQ</a>
              <a href="#availability" className="hover:text-warm-ivory transition-colors">Book Session</a>
            </div>
          </div>

          {/* Column Right: Contact overview info & Payments */}
          <div className="md:col-span-3 space-y-6 text-sm text-warm-ivory/80">
            <div className="space-y-4">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-soft-sage">
                Practice Hours
              </h4>
              <div className="space-y-1">
                <p>Appointment Only</p>
                <p className="text-soft-sage">Flexible Schedule</p>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-soft-sage">
                Payment Support
              </h4>
              <div className="flex flex-wrap gap-2 items-center">
                <CashLogo />
                <PhonePeLogo />
                <GPayLogo />
                <PaytmLogo />
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Creator Credit */}
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-warm-ivory/10">
          <p className="text-xs text-warm-ivory/60 leading-relaxed text-center sm:text-left">
            © {currentYear} Hijama by Shanu. All rights reserved. Designed. Developed. Delivered. by{" "}
            <a
              href="https://shanuandco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-sage hover:underline hover:text-warm-ivory font-semibold transition-colors"
            >
              shanu&co
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}
