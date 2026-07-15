export default function SessionProcess() {
  const steps = [
    {
      num: "01",
      title: "Initial Conversation",
      desc: "Before any cups are placed, we briefly discuss your comfort level, any general concerns, and check if cupping is appropriate for you.",
    },
    {
      num: "02",
      title: "Preparation & Hygiene",
      desc: "The session table is cleaned and disposable covers are applied. Single-use equipment is unpacked in your presence.",
    },
    {
      num: "03",
      title: "Cupping Session",
      desc: "The planned cupping process is performed with a gentle focus on your comfort. Suction levels are adapted to your feedback.",
    },
    {
      num: "04",
      title: "Aftercare Guidance",
      desc: "We discuss basic guidelines: keeping the skin clean, protected from direct wind, hydrated, and avoiding strenuous exercise for 24 hours.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
            Step-by-Step Experience
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
            What to Expect in a Session
          </h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-sans">
            Our sessions are structured to prioritize your safety, comfort, and comprehension. From start to finish, you are guided through a gentle, professional workflow.
          </p>
        </div>

        {/* Visual Timeline Layout */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 lg:gap-8">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-[1px] bg-border z-0" />

          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative flex flex-col items-center md:items-start text-center md:text-left space-y-4 group z-10"
            >
              {/* Timeline circle / number indicator */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background border-2 border-border group-hover:border-deep-olive transition-colors duration-300 z-10 shadow-sm">
                <span className="font-serif text-3xl text-deep-olive dark:text-soft-sage select-none font-bold">
                  {step.num}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-2 max-w-xs md:max-w-none">
                <h3 className="font-sans font-bold text-lg text-deep-olive dark:text-soft-sage pt-2">
                  {step.title}
                </h3>
                <p className="text-sm text-foreground/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
