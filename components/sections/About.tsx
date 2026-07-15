import { Award } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Column Left: Introduction */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
              The Therapist
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
              Meet Asfan Shanu
            </h2>
            <div className="space-y-6 text-base md:text-lg text-foreground/80 leading-relaxed font-sans">
              <p>
                What began as a genuine interest in cupping therapy gradually grew into a commitment to providing thoughtful, responsible, and personalized care to every client I work with.
              </p>
              <p>
                Over the past 2+ years, I have gained hands-on experience in cupping therapy, worked with 100+ clients, and served across multiple Hijama camps. These experiences have given me the opportunity to work with people with different concerns and wellness needs, shaping the way I approach every session today.
              </p>
              <p>
                As a certified cupping therapist, I believe there is no one-size-fits-all approach to care. I take the time to understand each client&apos;s concerns and needs before proceeding, allowing every session to be approached with greater attention and purpose.
              </p>
              <p>
                My practice is built around client comfort, hygiene, responsible care, and clear communication. From the initial consultation to the cupping process and aftercare guidance, my aim is to ensure every client feels comfortable, informed, and cared for throughout their experience.
              </p>
              <p>
                Every session is appointment-only, allowing me to dedicate proper time and attention to each client—because quality care should always be personal, thoughtful, and never rushed.
              </p>
            </div>
          </div>

          {/* Column Right: Background & Certification Cards */}
          <div className="lg:col-span-6 flex flex-col space-y-8">
            <h3 className="font-serif text-2xl font-semibold text-deep-olive dark:text-soft-sage">
              Background & Qualifications
            </h3>

            {/* Cupping Certification Card */}
            <div className="rounded-2xl border border-border bg-muted/20 p-6 flex items-start gap-4 hover:border-soft-sage/60 transition-colors">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-deep-olive/10 text-deep-olive dark:text-soft-sage">
                <Award className="h-6 w-6" />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-xs uppercase tracking-wider text-muted-gold font-semibold">
                  Professional Certification
                </span>
                <h4 className="font-sans font-bold text-foreground">
                  Certified Cupping Therapist
                </h4>
                <div className="text-sm text-foreground/75 space-y-1">
                  <p><strong>Certification Name:</strong> Diploma in Cupping Therapy</p>
                  <p><strong>Issuing Organisation:</strong> National Board of Vocational Training Education (NBVTE)</p>
                  <p><strong>Training Institue/Study Centre:</strong> Zeal Academy</p>
                  <p><strong>Certification Year:</strong> 2024</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section >
  );
}
