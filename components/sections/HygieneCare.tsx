import { Home, Sparkles, Heart, Clock } from "lucide-react";

export default function HygieneCare() {
  const cards = [
    {
      icon: Home,
      title: "Clean Environment",
      desc: "Sessions are conducted in a prepared, tidy, and hygienic setting designed for tranquility.",
    },
    {
      icon: Sparkles,
      title: "Session Preparation",
      desc: "The therapy table and immediate environment are prepared and sanitized before each scheduled client arrival.",
    },
    {
      icon: Heart,
      title: "Equipment Care",
      desc: "Suction cups and extraction tools are single-use or sanitized according to strict hygiene standards.",
    },
    {
      icon: Clock,
      title: "Personal Attention",
      desc: "Every booking has dedicated buffer times, ensuring no overlap and enabling absolute focus on your care.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
            Safety Standards
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
            Your Comfort & Hygiene Matter
          </h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-sans">
            In our practice, health safety is not an afterthought. We take the necessary time and precautions to ensure you feel secure, relaxed, and valued during your entire visit.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-muted/10 border border-border p-8 rounded-3xl flex flex-col space-y-4 hover:bg-muted/25 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-soft-sage/10 text-deep-olive dark:text-soft-sage flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-deep-olive dark:text-soft-sage">
                  {card.title}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
