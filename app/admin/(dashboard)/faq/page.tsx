"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminFaqs, upsertFaq, deleteFaq } from "@/lib/actions/settings";
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
  HelpCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export default function AdminFaq() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal forms
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAdminFaqs();
      setFaqs(data as FAQItem[]);
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "Failed to load FAQs."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchFaqs(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchFaqs]);

  const openUpsertModal = (faq: FAQItem | null = null) => {
    setSelectedFaq(faq);
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setDisplayOrder(faq.display_order);
      setIsActive(faq.is_active);
    } else {
      setQuestion("");
      setAnswer("");
      setDisplayOrder(faqs.length + 1);
      setIsActive(true);
    }
    setModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !answer) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setModalOpen(false);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: FAQItem = {
      question,
      answer,
      display_order: Number(displayOrder),
      is_active: isActive,
    };

    if (selectedFaq?.id) {
      payload.id = selectedFaq.id;
    }

    try {
      const res = await upsertFaq(payload);
      if (res.success) {
        setSuccessMsg(
          selectedFaq?.id 
            ? "FAQ question updated successfully." 
            : "FAQ question created successfully."
        );
        fetchFaqs();
      } else {
        setErrorMsg(res.message || "Could not save FAQ.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await deleteFaq(id);
      if (res.success) {
        setSuccessMsg("FAQ deleted successfully.");
        fetchFaqs();
      } else {
        setErrorMsg(res.message || "Could not delete FAQ.");
      }
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err, "An error occurred."));
    }
  };

  const handleToggleActive = async (faq: FAQItem) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await upsertFaq({
        ...faq,
        is_active: !faq.is_active,
      });
      if (res.success) {
        setSuccessMsg(`FAQ status toggled successfully.`);
        fetchFaqs();
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
          <h1 className="text-3xl font-serif text-deep-olive">FAQ Management</h1>
          <p className="text-sm text-foreground/70">
            Write, edit, and organize frequently asked questions to educate public visitors about cupping procedures.
          </p>
        </div>
        <Button onClick={() => openUpsertModal()} className="rounded-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create FAQ
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

      {/* FAQs List */}
      <div className="max-w-4xl bg-background border border-border rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <p className="p-8 text-sm text-foreground/60 italic">Loading FAQ list...</p>
        ) : faqs.length > 0 ? (
          <div className="divide-y divide-border/60">
            {faqs.map((faq) => (
              <div 
                key={faq.id}
                className="p-6 flex flex-col sm:flex-row justify-between items-start gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold bg-muted text-foreground/70 px-2 py-0.5 rounded">
                      Order: {faq.display_order}
                    </span>
                    <h3 className="font-sans font-bold text-base text-deep-olive dark:text-soft-sage">
                      {faq.question}
                    </h3>
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                      faq.is_active 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-zinc-50 text-zinc-500 border-zinc-200"
                    }`}>
                      {faq.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed font-sans">
                    {faq.answer}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0 sm:self-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleActive(faq)}
                    className="h-9 w-9 rounded-full border-border/80 text-foreground hover:bg-muted"
                    title={faq.is_active ? "Deactivate" : "Activate"}
                  >
                    {faq.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4.5 w-4.5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openUpsertModal(faq)}
                    className="h-9 w-9 rounded-full border-border/80 text-foreground hover:bg-muted"
                    title="Edit FAQ"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => faq.id && handleDelete(faq.id)}
                    className="h-9 w-9 rounded-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    title="Delete FAQ"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border-t border-border flex flex-col items-center justify-center space-y-3">
            <HelpCircle className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm font-semibold text-foreground/80">No FAQ questions created yet.</p>
          </div>
        )}
      </div>

      {/* UPSERT FAQ DIALOG */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg bg-background border border-border rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-deep-olive">
              {selectedFaq ? "Edit FAQ Question" : "Create FAQ Question"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveFaq} className="space-y-4 py-2">
            
            {/* Question */}
            <div className="space-y-1.5">
              <Label htmlFor="faqQuestion" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Question
              </Label>
              <Input
                id="faqQuestion"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. What should I wear to my appointment?"
                className="rounded-xl h-11 bg-background"
                required
              />
            </div>

            {/* Answer */}
            <div className="space-y-1.5">
              <Label htmlFor="faqAnswer" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Answer
              </Label>
              <Textarea
                id="faqAnswer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Provide a clear, simple, and responsible answer..."
                className="rounded-xl min-h-[120px] bg-background"
                required
              />
            </div>

            {/* Order & Status Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="faqOrder" className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Display Order
                </Label>
                <Input
                  id="faqOrder"
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
                Save FAQ
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
