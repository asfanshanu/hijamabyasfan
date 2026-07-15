import Image from "next/image";

export default function Hero() {
  return (
    <section id="home" className="relative bg-background py-16 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero Content Left */}
          <div className="flex flex-col space-y-8 lg:col-span-7 animate-in fade-in slide-in-from-bottom-6 duration-700">

            <h1 className="text-5xl md:text-7xl font-serif text-deep-olive dark:text-soft-sage leading-[1.08] tracking-tight">
              Cupping care, <br />
              <span className="italic font-normal text-muted-gold">with a personal approach.</span>
            </h1>
            
            <p className="max-w-xl text-lg md:text-xl font-sans text-foreground/80 leading-relaxed">
              Certified cupping therapist offering professional, appointment-based cupping sessions with a focus on comfort, hygiene and individual care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#availability" 
                className="group/button inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 h-12 px-8 text-base font-semibold whitespace-nowrap transition-all outline-none select-none cursor-pointer text-center"
              >
                Book an Appointment
              </a>
              
              <a 
                href="#cupping" 
                className="group/button inline-flex shrink-0 items-center justify-center rounded-full border border-deep-olive/20 text-deep-olive hover:bg-deep-olive/5 bg-background h-12 px-8 text-base font-semibold whitespace-nowrap transition-all outline-none select-none cursor-pointer text-center dark:text-soft-sage dark:border-soft-sage/20 dark:hover:bg-soft-sage/5"
              >
                Learn About Cupping
              </a>
            </div>
          </div>
          
          {/* Hero Portrait Right */}
          <div className="lg:col-span-5 flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-900 delay-100">
            <div className="relative w-full max-w-sm md:max-w-md aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden border border-border/60 shadow-2xl group">
              <Image
                src="/therapist_portrait.jpg"
                alt="Asfan Shanu, Certified Cupping Therapist"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, 450px"
              />
              {/* Overlay label */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-background/85 backdrop-blur-md px-6 py-4 flex flex-col border border-border/50">
                <span className="font-serif text-xl font-semibold text-deep-olive dark:text-soft-sage">
                  Asfan Shanu
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-gold font-medium">
                  Certified Cupping Therapist
                </span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
