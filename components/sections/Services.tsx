import { 
  Calendar, 
  UserCheck, 
  MessageSquare, 
  Flame, 
  Wind, 
  Droplets, 
  Waves, 
  Snowflake, 
  Activity 
} from "lucide-react";

export interface Service {
  id: string;
  title: string;
  description: string;
  cta_label: string;
  display_order: number;
  is_active: boolean;
}

interface ServicesProps {
  services?: Service[];
}

export default function Services({ services }: ServicesProps) {
  // Safe default fallback services as specified in requirements
  const defaultServices: Service[] = [
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
    {
      id: "4",
      title: "Fire Cupping",
      description: "Traditional therapy utilizing glass cups and localized heat to create vacuum suction, promoting deep muscle relaxation and blood circulation.",
      cta_label: "View Availability",
      display_order: 4,
      is_active: true,
    },
    {
      id: "5",
      title: "Dry Cupping",
      description: "A therapeutic procedure using mechanical suction pumps without incisions, targeting muscle tension and tissue release.",
      cta_label: "View Availability",
      display_order: 5,
      is_active: true,
    },
    {
      id: "6",
      title: "Wet Cupping (Hijama)",
      description: "The traditional therapeutic practice involving controlled surface scratches to draw out stale blood and promote body detoxification.",
      cta_label: "View Availability",
      display_order: 6,
      is_active: true,
    },
    {
      id: "7",
      title: "Water Cupping",
      description: "Specialized cupping where glass cups are filled one-third with warm water before application, offering a unique soothing effect.",
      cta_label: "View Availability",
      display_order: 7,
      is_active: true,
    },
    {
      id: "8",
      title: "Ice Cupping",
      description: "A refreshing application using chilled cups or ice blocks inside cups to reduce acute muscle soreness and inflammation.",
      cta_label: "View Availability",
      display_order: 8,
      is_active: true,
    },
    {
      id: "9",
      title: "Treatment-Based Cupping",
      description: "Customized therapy sessions designed specifically to address chronic back discomfort, headaches, or physical recovery.",
      cta_label: "View Availability",
      display_order: 9,
      is_active: true,
    },
  ];

  const activeServices = (services ?? defaultServices)
    .filter((service) => service.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  // Icons mapper based on display order or index
  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return Calendar;
      case 1:
        return UserCheck;
      case 2:
        return MessageSquare;
      case 3:
        return Flame;
      case 4:
        return Wind;
      case 5:
        return Droplets;
      case 6:
        return Waves;
      case 7:
        return Snowflake;
      default:
        return Activity;
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-muted/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
            Offered Services
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
            Therapy & Consulting Options
          </h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-sans">
            Choose from general appointment bookings, dedicated scheduled sessions, or ask pre-session questions. All services focus on safety and traditional care.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeServices.length > 0 ? (
            activeServices.map((service, idx) => {
              const Icon = getIcon(idx);
              const isEnquiry = service.title.toLowerCase().includes("enquiry") || service.title.toLowerCase().includes("question");
              const ctaHref = isEnquiry ? "#contact" : "#availability";

              return (
                <div
                  key={service.id}
                  className="flex flex-col justify-between bg-background border border-border rounded-3xl p-8 shadow-sm hover:shadow-md hover:border-soft-sage transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    {/* Card Icon */}
                    <div className="h-12 w-12 rounded-2xl bg-soft-sage/10 text-deep-olive dark:text-soft-sage flex items-center justify-center transition-colors group-hover:bg-deep-olive group-hover:text-background duration-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-sans font-bold text-xl text-deep-olive dark:text-soft-sage">
                        {service.title}
                      </h3>
                      <p className="text-sm text-foreground/85 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <a 
                      href={ctaHref} 
                      className={`flex items-center justify-center gap-1.5 w-full rounded-full py-3.5 font-medium text-sm transition-all select-none border text-center ${
                        isEnquiry 
                          ? "border-deep-olive/20 text-deep-olive hover:bg-deep-olive/5 dark:text-soft-sage dark:border-soft-sage/20 dark:hover:bg-soft-sage/5" 
                          : "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent"
                      }`}
                    >
                      {service.cta_label}
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 bg-background border border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center space-y-2">
              <p className="text-sm font-semibold text-foreground/80">No services available at the moment.</p>
              <p className="text-xs text-foreground/60">Please check back later or contact Asfan directly.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
