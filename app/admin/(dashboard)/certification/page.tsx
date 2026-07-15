"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminCertifications, updateCertification } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, AlertCircle, CheckCircle2, Save } from "lucide-react";
import Image from "next/image";
import { getErrorMessage } from "@/lib/utils";

interface CertificationItem {
  id?: string;
  certificate_name: string;
  issuing_organisation: string;
  certification_year: number;
  certificate_image_url: string;
  is_active: boolean;
}

export default function AdminCertification() {
  const [cert, setCert] = useState<CertificationItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Notification states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [certificateName, setCertificateName] = useState("");
  const [issuingOrganisation, setIssuingOrganisation] = useState("");
  const [certificationYear, setCertificationYear] = useState(2025);
  const [certificateImageUrl, setCertificateImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  const fetchCertification = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminCertifications();
      if (data) {
        setCert(data as CertificationItem);
        setCertificateName(data.certificate_name);
        setIssuingOrganisation(data.issuing_organisation);
        setCertificationYear(data.certification_year);
        setCertificateImageUrl(data.certificate_image_url);
        setIsActive(data.is_active);
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Failed to load certification details."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchCertification(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchCertification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateName || !issuingOrganisation || !certificateImageUrl) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: CertificationItem = {
      certificate_name: certificateName,
      issuing_organisation: issuingOrganisation,
      certification_year: Number(certificationYear),
      certificate_image_url: certificateImageUrl,
      is_active: isActive,
    };

    if (cert?.id) {
      payload.id = cert.id;
    }

    try {
      const res = await updateCertification(payload);
      if (res.success) {
        setSuccessMsg("Certification credentials saved successfully.");
        fetchCertification();
      } else {
        setErrorMsg(res.message || "Could not save credentials.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col space-y-2 border-b border-border/60 pb-6">
        <h1 className="text-3xl font-serif text-deep-olive">Certification Management</h1>
        <p className="text-sm text-foreground/70">
          Verify and update the professional certificate details displayed in the landing page trust section.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-2.5 text-xs font-bold text-destructive max-w-4xl">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-2.5 text-xs font-bold text-emerald-800 max-w-4xl">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-foreground/60 italic">Retrieving certification file...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl">
          
          {/* Left Panel: Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="font-sans font-bold text-base text-deep-olive flex items-center gap-2 border-b border-border/50 pb-2">
              <Award className="h-5 w-5 text-soft-sage" />
              Credentials Form
            </h2>

            {/* Certificate Name */}
            <div className="space-y-1.5">
              <Label htmlFor="certName" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Certificate Name
              </Label>
              <Input
                id="certName"
                value={certificateName}
                onChange={(e) => setCertificateName(e.target.value)}
                placeholder="e.g. Certificate in Hijama (Cupping) Therapy"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Issuing Organisation */}
            <div className="space-y-1.5">
              <Label htmlFor="certIssuer" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Issuing Organisation
              </Label>
              <Input
                id="certIssuer"
                value={issuingOrganisation}
                onChange={(e) => setIssuingOrganisation(e.target.value)}
                placeholder="e.g. Al-Hijama Training Institute"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Year & Active status grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="certYear" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Certification Year
                </Label>
                <Input
                  id="certYear"
                  type="number"
                  value={certificationYear}
                  onChange={(e) => setCertificationYear(Number(e.target.value))}
                  className="rounded-xl h-11 bg-background"
                  required
                />
              </div>

              <div className="flex flex-col justify-end pb-1.5 pl-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-deep-olive accent-deep-olive"
                  />
                  <span>Active & Displayed</span>
                </label>
              </div>
            </div>

            {/* Image URL path */}
            <div className="space-y-1.5">
              <Label htmlFor="certUrl" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Certificate Image Filepath / URL
              </Label>
              <Input
                id="certUrl"
                value={certificateImageUrl}
                onChange={(e) => setCertificateImageUrl(e.target.value)}
                placeholder="e.g. /certificate_placeholder.png"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={saving} className="w-full rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving Credentials..." : "Save Certification Details"}
            </Button>

          </form>

          {/* Right Panel: Current Preview */}
          <div className="lg:col-span-5 bg-background border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-sans font-bold text-sm text-deep-olive border-b border-border/50 pb-2">
              Certificate Image Preview
            </h3>
            
            {certificateImageUrl ? (
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border shadow-inner bg-muted/20">
                <Image
                  src={certificateImageUrl}
                  alt="Certificate Image Preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="aspect-[4/3] w-full rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground italic bg-muted/10">
                No image file path selected
              </div>
            )}
            
            <p className="text-[11px] text-foreground/60 leading-normal bg-muted/10 p-3.5 rounded-xl">
              <strong>Tip:</strong> You can upload your credential document to Supabase Storage or add it directly to the <code>/public</code> directory, then write its file path (e.g. <code>/my_certificate.png</code>) above.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
