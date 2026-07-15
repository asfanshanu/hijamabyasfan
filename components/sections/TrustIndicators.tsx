import { ShieldCheck, CalendarRange, Sparkles, HeartPulse } from "lucide-react";

export default function TrustIndicators() {
  const indicators = [
    {
      icon: ShieldCheck,
      title: "Certified Therapist",
      desc: "Professionally trained and certified in traditional cupping procedures.",
    },
    {
      icon: CalendarRange,
      title: "Appointment Based",
      desc: "Dedicated time slots ensuring focused, uninterrupted sessions.",
    },
    {
      icon: Sparkles,
      title: "Hygiene Focused",
      desc: "Clean workspace with sanitized and single-use disposable equipment.",
    },
    {
      icon: HeartPulse,
      title: "Personal Care",
      desc: "Focused on understanding your comfort and history prior to cupping.",
    },
  ];

  return (
    <section className="bg-muted/40 border-y border-border/80 py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-background/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-soft-sage/20 text-deep-olive dark:text-soft-sage">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col space-y-1">
                  <h3 className="font-sans text-base font-semibold text-deep-olive dark:text-soft-sage">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/75 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
