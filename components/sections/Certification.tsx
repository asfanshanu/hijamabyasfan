import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface CertificationData {
  id: string;
  certificate_name: string;
  issuing_organisation: string;
  certification_year: number;
  certificate_image_url: string;
  is_active: boolean;
}

interface CertificationProps {
  certification?: CertificationData;
}

export default function Certification({ certification }: CertificationProps) {
  if (!certification || !certification.is_active) return null;

  const cert = certification;

  return (
    <section className="py-20 md:py-28 bg-muted/20 border-y border-border">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-gold">
            Therapist Verification
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-deep-olive dark:text-soft-sage">
            Certified Practice
          </h2>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-sans">
            Transparency is key to building trust. You can inspect the professional training certification details and credentials below.
          </p>
        </div>

        {/* Certificate Display Layout */}
        <div className="max-w-4xl mx-auto bg-background border border-border rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Details Column */}
          <div className="p-8 md:p-12 md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted-gold font-semibold">
                Verified Credential
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-deep-olive dark:text-soft-sage leading-snug">
                {cert.certificate_name}
              </h3>
            </div>

            <div className="border-t border-border/80 pt-6 space-y-3 font-sans text-sm md:text-base text-foreground/85">
              <p>
                <strong className="text-deep-olive dark:text-soft-sage">Issuing Organization:</strong> <br />
                {cert.issuing_organisation}
              </p>
              <p>
                <strong className="text-deep-olive dark:text-soft-sage">Year of Issuance:</strong> <br />
                {cert.certification_year}
              </p>
              <p>
                <strong className="text-deep-olive dark:text-soft-sage">Scope of Study:</strong> <br />
                Acupoints selection, dry & wet cupping applications, hygienic extraction, safety protocols, and clinic sanitation procedures.
              </p>
            </div>

            <div className="pt-4">
              <Dialog>
                <DialogTrigger className="group/button inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80 h-8 px-8 font-medium whitespace-nowrap transition-all outline-none select-none cursor-pointer">
                  View Credential
                </DialogTrigger>
                <DialogContent className="max-w-3xl w-[90vw] overflow-y-auto bg-background/95 backdrop-blur border border-border rounded-3xl p-6">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="font-serif text-xl text-deep-olive">
                      {cert.certificate_name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border shadow-md">
                    <Image
                      src={cert.certificate_image_url}
                      alt={cert.certificate_name}
                      fill
                      className="object-contain"
                      sizes="(max-w-1024px) 100vw, 800px"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Graphic Thumbnail Column */}
          <div className="md:col-span-5 aspect-[4/3] relative w-full bg-muted/40 h-full border-t md:border-t-0 md:border-l border-border flex items-center justify-center p-6 md:p-8">
            <div className="relative w-full h-full min-h-[220px] rounded-2xl overflow-hidden border border-border/70 shadow-sm group">
              <Image
                src={cert.certificate_image_url}
                alt="Certificate preview thumbnail"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, 350px"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
