import { MessageCircle, Phone, Mail } from "lucide-react";

export interface ContactDetails {
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
}

interface ContactProps {
  contactInfo?: ContactDetails;
}

export default function Contact({ contactInfo }: ContactProps) {
  const info = contactInfo || {
    phone: "",
    whatsapp: "",
    email: "",
    location: "",
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-muted/20 border border-border rounded-[2.5rem] p-8 md:p-16">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
              Have a question?
            </h2>
            <p className="text-sm md:text-base text-foreground/80 leading-relaxed font-sans">
              If you would like to understand the session details, discuss comfort concerns, or ask any question before booking an appointment, please feel free to reach out directly.
            </p>
            

          </div>

          {/* Right Links Column */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* WhatsApp CTA */}
            <a 
              href={`https://wa.me/${info.whatsapp}?text=Hello%20Asfan,%20I'd%20like%20to%20inquire%20about%20a%20cupping%20session.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 text-base w-full rounded-full py-4 font-medium bg-[#25D366] hover:bg-[#20ba59] text-white border-0 transition-colors select-none text-center"
            >
              <MessageCircle className="h-5 w-5 fill-current" />
              Message via WhatsApp
            </a>

            {/* Call CTA */}
            <a 
              href={`tel:${info.phone}`} 
              className="flex items-center justify-center gap-3 text-base w-full rounded-full py-4 font-medium border border-deep-olive/20 text-deep-olive hover:bg-deep-olive/5 transition-colors select-none text-center dark:text-soft-sage dark:border-soft-sage/20 dark:hover:bg-soft-sage/5"
            >
              <Phone className="h-5 w-5" />
              Call Directly
            </a>

            {/* Email CTA */}
            <a 
              href={`mailto:${info.email}`} 
              className="flex items-center justify-center gap-3 text-base w-full rounded-full py-4 font-medium text-foreground hover:bg-muted/80 transition-colors select-none text-center"
            >
              <Mail className="h-5 w-5" />
              Send an Email
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}
