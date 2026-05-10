"use client";

import React, { useState } from "react";
import { useFAQs, useUpdateFAQ, useDeleteFAQ } from "@/hooks/useCMS";
import { HelpCircle, Plus, Edit3, Trash2, XCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SortableList } from "../components/SortableList";

export default function FAQTab() {
  const { data: faqs, isLoading } = useFAQs();
  const { mutate: updateFAQ } = useUpdateFAQ();
  const { mutate: deleteFAQ } = useDeleteFAQ();
  const [editingFAQ, setEditingFAQ] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">
            FAQ Manager
          </h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">
            Manage customer support and common inquiries
          </p>
        </div>

        <button
          onClick={() =>
            setEditingFAQ({
              questionEn: "",
              answerEn: "",
              questionBn: "",
              answerBn: "",
              order: (faqs?.length || 0) + 1,
            })
          }
          className="bg-primary hover:bg-primary-light text-white px-8 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add New FAQ
        </button>
      </div>

      <div className="glass-card rounded-[40px] border-white/5 p-8 lg:p-12">
        <SortableList
          items={faqs || []}
          onReorder={(newItems) => {
            // Reorder logic would go here if needed per API
          }}
          renderItem={(faq) => (
            <div className="bg-white/[0.02] p-8 rounded-3xl border border-white/5 flex items-center justify-between group">
              <div>
                <h4 className="text-xl font-black tracking-tight mb-2">
                  {faq.questionEn}
                </h4>
                <p className="text-text-muted text-sm line-clamp-1">
                  {faq.answerEn}
                </p>
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => setEditingFAQ(faq)}
                  className="w-10 h-10 rounded-xl bg-white/5 text-text-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete?")) deleteFAQ(faq._id);
                  }}
                  className="w-10 h-10 rounded-xl bg-white/5 text-text-muted hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingFAQ && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-bg-dark rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tighter">
                  Edit FAQ
                </h3>
                <button
                  onClick={() => setEditingFAQ(null)}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                    Question (EN)
                  </label>
                  <input
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50"
                    value={editingFAQ.questionEn}
                    onChange={(e) =>
                      setEditingFAQ({
                        ...editingFAQ,
                        questionEn: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                    Answer (EN)
                  </label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[120px]"
                    value={editingFAQ.answerEn}
                    onChange={(e) =>
                      setEditingFAQ({ ...editingFAQ, answerEn: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="p-8 border-t border-white/5 flex justify-end gap-4">
                <button
                  onClick={() => setEditingFAQ(null)}
                  className="px-6 py-4 text-xs font-black uppercase text-text-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateFAQ(editingFAQ);
                    setEditingFAQ(null);
                  }}
                  className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest"
                >
                  Save FAQ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
