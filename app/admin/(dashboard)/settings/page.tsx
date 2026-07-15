"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminSiteSettings, updateSiteSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, AlertCircle, CheckCircle2, Save, Info } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Notification states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Settings values
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminSiteSettings();
      if (data) {
        setPhone(data.phone || "");
        setWhatsapp(data.whatsapp || "");
        setEmail(data.email || "");
        setLocation(data.location || "");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Failed to load site settings."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchSettings(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !whatsapp || !email || !location) {
      setErrorMsg("Please fill out all contact fields.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      phone,
      whatsapp,
      email,
      location,
    };

    try {
      const res = await updateSiteSettings(payload);
      if (res.success) {
        setSuccessMsg("Site settings updated successfully.");
        fetchSettings();
      } else {
        setErrorMsg(res.message || "Could not save settings.");
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
        <h1 className="text-3xl font-serif text-deep-olive">Site Settings</h1>
        <p className="text-sm text-foreground/70">
          Configure general website information, contact phone numbers, and practice locations.
        </p>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 flex items-start gap-2.5 text-xs font-bold text-destructive max-w-3xl">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-2.5 text-xs font-bold text-emerald-800 max-w-3xl">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-foreground/60 italic">Retrieving settings variables...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-4xl">
          
          {/* Left Panel: Settings Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="font-sans font-bold text-base text-deep-olive flex items-center gap-2 border-b border-border/50 pb-2">
              <Settings className="h-5 w-5 text-soft-sage" />
              Contact Information settings
            </h2>

            {/* Direct Call Number */}
            <div className="space-y-1.5">
              <Label htmlFor="setPhone" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Phone Number (Direct Call CTA)
              </Label>
              <Input
                id="setPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* WhatsApp Number */}
            <div className="space-y-1.5">
              <Label htmlFor="setWhatsapp" className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                WhatsApp Country Code & Number
                <span className="text-[10px] text-foreground/50 font-normal lowercase">(no spaces or + prefix)</span>
              </Label>
              <Input
                id="setWhatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="e.g. 919876543210"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="setEmail" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Email Address
              </Label>
              <Input
                id="setEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. asfan@example.com"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* General Location */}
            <div className="space-y-1.5">
              <Label htmlFor="setLocation" className="text-xs font-bold uppercase tracking-wider text-foreground">
                General Practice Location
              </Label>
              <Input
                id="setLocation"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Shirur, Karnataka, India"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={saving} className="w-full rounded-full py-6 text-base font-semibold flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving variables..." : "Save Settings Configuration"}
            </Button>

          </form>

          {/* Right Panel: Information */}
          <div className="lg:col-span-4 bg-muted/10 border border-border/80 rounded-3xl p-6 space-y-4">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-muted-gold flex items-center gap-1.5">
              <Info className="h-4.5 w-4.5" />
              Developer Notice
            </h3>
            <div className="text-xs text-foreground/85 leading-relaxed space-y-3 font-sans">
              <p>
                <strong>WhatsApp Formatting:</strong> <br />
                The WhatsApp API requires an international prefix code (e.g. <code>91</code> for India) without plus (+) signs or whitespaces. Example: <code>919876543210</code>.
              </p>
              <p>
                <strong>Security note:</strong> <br />
                Do not publicly display Asfan&apos;s private residential street details. Keep the location set to <em>Shirur, Karnataka, India</em> to ensure therapist privacy.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
