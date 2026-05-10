"use client";

import React, { useState } from "react";
import { useFAQs, useUpdateFAQ, useDeleteFAQ } from "@/hooks/useCMS";
import { HelpCircle, Plus, Edit3, Trash2, XCircle, Check, Eye, EyeOff, ChevronDown, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function FAQTab() {
  const { data: faqs, isLoading } = useFAQs();
  const { mutate: updateFAQ } = useUpdateFAQ();
  const { mutate: deleteFAQ } = useDeleteFAQ();
  const [editingFAQ, setEditingFAQ] = useState<any>(null);

  const handleToggleVisibility = (faq: any) => {
    updateFAQ({ ...faq, visible: !faq.visible }, {
      onSuccess: () => toast.success("Visibility updated"),
      onError: () => toast.error("Update failed")
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteFAQ(id, {
        onSuccess: () => toast.success("FAQ deleted"),
        onError: () => toast.error("Delete failed")
      });
    }
  };

  const handleSave = () => {
    if (!editingFAQ.qEn || !editingFAQ.aEn) {
      toast.error("Question and Answer in English are required");
      return;
    }
    updateFAQ(editingFAQ, {
      onSuccess: () => {
        toast.success("FAQ saved successfully!");
        setEditingFAQ(null);
      },
      onError: () => toast.error("Failed to save FAQ")
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  const sortedFAQs = [...(faqs || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter mb-2">Help Center</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">
            Manage customer support and common inquiries
          </p>
        </div>

        <button
          onClick={() =>
            setEditingFAQ({
              qEn: "",
              aEn: "",
              qBn: "",
              aBn: "",
              visible: true,
              order: (faqs?.length || 0) + 1,
            })
          }
          className="bg-primary hover:bg-primary-light text-white px-10 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Add New FAQ
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-6">
        {sortedFAQs.map((faq, idx) => (
          <FAQCard
            key={faq._id}
            faq={faq}
            idx={idx}
            onEdit={() => setEditingFAQ(JSON.parse(JSON.stringify(faq)))}
            onToggleVisibility={() => handleToggleVisibility(faq)}
            onDelete={() => handleDelete(faq._id)}
          />
        ))}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingFAQ && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-3xl bg-[#020617] rounded-[48px] border border-white/10 overflow-hidden shadow-2xl my-8"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white">{editingFAQ._id ? "Edit FAQ" : "Add FAQ"}</h3>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">Question Management</p>
                  </div>
                </div>
                <button onClick={() => setEditingFAQ(null)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <XCircle className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="p-8 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#020617]">
                <div className="space-y-8">
                  <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">English Version</h4>
                  <InputField label="Question (EN)" value={editingFAQ.qEn} onChange={(v: any) => setEditingFAQ({ ...editingFAQ, qEn: v })} />
                  <InputField label="Answer (EN)" value={editingFAQ.aEn} onChange={(v: any) => setEditingFAQ({ ...editingFAQ, aEn: v })} multiline />
                </div>

                <div className="space-y-8 pt-10 border-t border-white/5">
                  <h4 className="text-secondary font-black text-xs uppercase tracking-[3px] border-l-4 border-secondary pl-4">Bangla Version</h4>
                  <InputField label="Question (BN)" value={editingFAQ.qBn} onChange={(v: any) => setEditingFAQ({ ...editingFAQ, qBn: v })} />
                  <InputField label="Answer (BN)" value={editingFAQ.aBn} onChange={(v: any) => setEditingFAQ({ ...editingFAQ, aBn: v })} multiline />
                </div>

                <div className="pt-6 border-t border-white/5">
                  <InputField label="Display Order" type="number" value={editingFAQ.order} onChange={(v: any) => setEditingFAQ({ ...editingFAQ, order: Number(v) })} />
                </div>
              </div>

              <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/[0.01]">
                <button onClick={() => setEditingFAQ(null)} className="px-8 py-5 text-xs font-black uppercase text-text-muted tracking-widest">Cancel</button>
                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-light transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Question
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQCard({ faq, idx, onEdit, onToggleVisibility, onDelete }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`glass-card rounded-[32px] border-white/5 relative group transition-all overflow-hidden ${!faq.visible ? "opacity-50 grayscale" : ""}`}
    >
      <div className="p-8 flex items-center justify-between gap-6 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-6 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all border border-white/10">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-black tracking-tight text-white group-hover:text-primary transition-colors">{faq.qEn}</h4>
            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-1">FAQ Item #{faq.order}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${faq.visible ? "bg-success/10 text-success border-success/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
            >
              {faq.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {faq.visible ? "Live" : "Hidden"}
            </button>
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="w-10 h-10 rounded-xl bg-white/5 text-text-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10">
              <Edit3 className="w-4.5 h-4.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="w-10 h-10 rounded-xl bg-white/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10">
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
          <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-8 pb-8 border-t border-white/5 bg-white/[0.01]"
          >
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">English Answer</span>
                <p className="text-text-secondary text-sm leading-relaxed">{faq.aEn}</p>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Bengali Answer</span>
                <p className="text-text-secondary text-sm leading-relaxed font-medium">{faq.aBn || "No Bengali translation provided."}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text", multiline = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">{label}</label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="admin-input min-h-[100px] w-full text-white placeholder:text-white/20"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="admin-input w-full text-white placeholder:text-white/20"
        />
      )}
    </div>
  );
}
