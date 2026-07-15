"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminServices, upsertService, deleteService } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ClipboardList,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { getErrorMessage } from "@/lib/error";

interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  cta_label: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit/Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminServices();
      setServices(data as ServiceItem[]);
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Failed to load services."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchServices(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchServices]);

  const openUpsertModal = (service: ServiceItem | null = null) => {
    setSelectedService(service);
    if (service) {
      setTitle(service.title);
      setDescription(service.description);
      setCtaLabel(service.cta_label);
      setDisplayOrder(service.display_order);
      setIsActive(service.is_active);
    } else {
      setTitle("");
      setDescription("");
      setCtaLabel("Book Now");
      setDisplayOrder(services.length + 1);
      setIsActive(true);
    }
    setModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !ctaLabel) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setModalOpen(false);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: ServiceItem = {
      title,
      description,
      cta_label: ctaLabel,
      display_order: Number(displayOrder),
      is_active: isActive,
    };

    if (selectedService?.id) {
      payload.id = selectedService.id;
    }

    try {
      const res = await upsertService(payload);
      if (res.success) {
        setSuccessMsg(
          selectedService?.id 
            ? "Service updated successfully." 
            : "Service created successfully."
        );
        fetchServices();
      } else {
        setErrorMsg(res.message || "Could not save service.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await deleteService(id);
      if (res.success) {
        setSuccessMsg("Service deleted successfully.");
        fetchServices();
      } else {
        setErrorMsg(res.message || "Could not delete service.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const handleToggleActive = async (service: ServiceItem) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await upsertService({
        ...service,
        is_active: !service.is_active,
      });
      if (res.success) {
        setSuccessMsg(`Service '${service.title}' status toggled successfully.`);
        fetchServices();
      } else {
        setErrorMsg(res.message || "Could not toggle status.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/60 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-deep-olive">Services Configuration</h1>
          <p className="text-sm text-foreground/70">
            Define wellness offerings, write summaries, and configure public CTA buttons.
          </p>
        </div>
        <Button onClick={() => openUpsertModal()} className="rounded-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Service
        </Button>
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

      {/* Services Table/List */}
      <div className="max-w-4xl bg-background border border-border rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <p className="p-8 text-sm text-foreground/60 italic">Loading services...</p>
        ) : services.length > 0 ? (
          <div className="divide-y divide-border/60">
            {services.map((service) => (
              <div 
                key={service.id}
                className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-muted text-foreground/70 px-2 py-0.5 rounded">
                      Order: {service.display_order}
                    </span>
                    <h3 className="font-sans font-bold text-base text-deep-olive dark:text-soft-sage">
                      {service.title}
                    </h3>
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                      service.is_active 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-zinc-50 text-zinc-500 border-zinc-200"
                    }`}>
                      {service.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed font-sans">
                    {service.description}
                  </p>
                  <p className="text-xs text-muted-gold font-bold font-sans">
                    Button label: &ldquo;{service.cta_label}&rdquo;
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleActive(service)}
                    className="h-9 w-9 rounded-full border-border/80 text-foreground hover:bg-muted"
                    title={service.is_active ? "Deactivate" : "Activate"}
                  >
                    {service.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4.5 w-4.5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openUpsertModal(service)}
                    className="h-9 w-9 rounded-full border-border/80 text-foreground hover:bg-muted"
                    title="Edit Service"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => service.id && handleDelete(service.id)}
                    className="h-9 w-9 rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete Service"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-t border-border flex flex-col items-center justify-center space-y-3">
            <ClipboardList className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground/80">No services created yet.</p>
          </div>
        )}
      </div>

      {/* UPSERT SERVICE DIALOG */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md bg-background border border-border rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-deep-olive">
              {selectedService ? "Edit Service" : "Create Service"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveService} className="space-y-4 py-2">
            
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="srvTitle" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Service Title
              </Label>
              <Input
                id="srvTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. General Cupping Session"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="srvDesc" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Description
              </Label>
              <Textarea
                id="srvDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is included in the session..."
                className="rounded-xl min-h-[90px] bg-background"
                required
              />
            </div>

            {/* CTA Label */}
            <div className="space-y-1.5">
              <Label htmlFor="srvCta" className="text-xs font-bold uppercase tracking-wider text-foreground">
                CTA Button Text
              </Label>
              <Input
                id="srvCta"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="e.g. View Availability"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Display Order & Active status grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="srvOrder" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Display Order
                </Label>
                <Input
                  id="srvOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
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
                  <span>Active Status</span>
                </label>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" className="rounded-full" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-full">
                Save Service
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
