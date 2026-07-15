import { HelpCircle, AlertCircle, RefreshCw, Sun, Award } from "lucide-react";
import Image from "next/image";

export default function UnderstandingCupping() {
  const principles = [
    {
      icon: RefreshCw,
      title: "May Support Muscle Relief",
      desc: "Cupping is commonly used by people experiencing muscular tightness or physical discomfort. The controlled suction may help provide temporary relief and is often included as part of a wider recovery or wellness routine.",
    },
    {
      icon: Sun,
      title: "Encourages Local Blood Flow",
      desc: "The suction created by the cups draws blood toward the treated area and increases local blood flow. This is one reason cupping is commonly used around areas of muscular tension and physical discomfort.",
    },
    {
      icon: HelpCircle,
      title: "Supports Relaxation & Well-being",
      desc: "Many people choose cupping or Hijama as part of their personal wellness and self-care routine. The experience may support physical relaxation and help reduce feelings of muscular tightness.",
    },
    {
      icon: Award,
      title: "Traditional Wellness Practice",
      desc: "Hijama has a long history as a traditional wet cupping practice. Today, many people continue to choose Hijama as a complementary wellness practice alongside appropriate medical care.",
    },
  ];

  return (
    <section id="cupping" className="py-20 md:py-28 bg-muted/30 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
            Responsible Education
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
            Understanding Cupping & Hijama
          </h2>
          <div className="text-base md:text-lg text-foreground/80 leading-relaxed font-sans space-y-4 text-left md:text-center">
            <p>
              Cupping is a traditional wellness practice in which specially designed cups are placed on the skin to create controlled suction. The suction gently lifts the skin and underlying tissues and is commonly used as a complementary practice for muscular tension, physical relaxation, and general well-being.
            </p>
            <p>
              Hijama, also known as wet cupping, is a specific form of cupping. The process usually begins with controlled suction, followed by small superficial incisions on the skin. The cups are then reapplied, allowing a small amount of blood to be drawn into the cup. This is the main difference between Hijama and dry cupping.
            </p>
            <p>
              Dry cupping does not involve incisions or blood removal, while Hijama involves a controlled wet cupping process. Because Hijama involves the skin, careful hygiene, clean equipment, and responsible practice are important.
            </p>
            <p>
              At Hijama by Shanu, we believe clients should understand the process before beginning a session. Our approach focuses on clear education, client comfort, cleanliness, and responsible care.
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-background border border-border p-8 rounded-3xl flex flex-col space-y-4 shadow-sm hover:border-soft-sage transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-soft-sage/10 text-deep-olive dark:text-soft-sage flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-sans font-bold text-lg text-deep-olive dark:text-soft-sage">
                  {item.title}
                </h3>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visual Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-sm group">
            <Image 
              src="/cupping_session_view.png" 
              alt="Hijama session in progress" 
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-w-768px) 100vw, 550px"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-6">
              <span className="text-white text-xs font-semibold uppercase tracking-wider">Hijama Session Setup</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border shadow-sm group">
            <Image 
              src="/cupping_tools_setup.png" 
              alt="Clean cupping equipment and oils" 
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-w-768px) 100vw, 550px"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-6">
              <span className="text-white text-xs font-semibold uppercase tracking-wider">Hygienic Equipment Prep</span>
            </div>
          </div>
        </div>

        {/* Responsible Disclaimer Box */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-background border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="h-12 w-12 rounded-full bg-muted-gold/15 text-muted-gold flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-base text-deep-olive dark:text-soft-sage">
              Our Practice Policy & Scope of Care
            </h4>
            <div className="text-sm text-foreground/75 leading-relaxed space-y-2">
              <p>
                We do not diagnose medical conditions, prescribe medication, or offer medical treatments. Cupping is a physical wellness practice intended to support localized comfort and relaxation.
              </p>
              <p>
                If you have complex medical conditions, acute pain, cardiovascular issues, skin sensitivities, or are pregnant, we strongly advise consulting with a licensed medical professional before scheduling any session.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
