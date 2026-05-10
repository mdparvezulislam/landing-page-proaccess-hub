"use client";

import React, { useState } from "react";
import { useReviews, useUpdateReview, useDeleteReview } from "@/hooks/useCMS";
import {
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  XCircle,
  Star,
  Eye,
  User,
  Image as ImageIcon,
  Check,
  ChevronDown,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ReviewsTab() {
  const { data: reviews, isLoading } = useReviews();
  const { mutate: updateReview } = useUpdateReview();
  const { mutate: deleteReview } = useDeleteReview();
  const [editingReview, setEditingReview] = useState<any>(null);

  const handleToggleVisibility = (review: any) => {
    updateReview({ ...review, visible: !review.visible }, {
      onSuccess: () => toast.success("Visibility updated"),
      onError: () => toast.error("Update failed")
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview(id, {
        onSuccess: () => toast.success("Review deleted"),
        onError: () => toast.error("Delete failed")
      });
    }
  };

  const handleSave = () => {
    if (!editingReview.name || !editingReview.reviewEn) {
      toast.error("Name and English Review are required");
      return;
    }
    updateReview(editingReview, {
      onSuccess: () => {
        toast.success("Review saved successfully!");
        setEditingReview(null);
      },
      onError: () => toast.error("Failed to save review")
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter mb-2">Social Proof</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[4px]">
            Manage customer testimonials and star ratings
          </p>
        </div>

        <button
          onClick={() =>
            setEditingReview({
              name: "",
              reviewEn: "",
              reviewBn: "",
              rating: 5,
              image: "",
              roleEn: "Verified Customer",
              roleBn: "ভেরিফাইড কাস্টমার",
              featured: false,
              visible: true,
              order: (reviews?.length || 0) + 1,
            })
          }
          className="bg-primary hover:bg-primary-light text-white px-10 py-6 rounded-[32px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Add Manual Review
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.map((review: any, idx: number) => (
          <ReviewCard
            key={review._id}
            review={review}
            idx={idx}
            onEdit={() => setEditingReview(JSON.parse(JSON.stringify(review)))}
            onToggleVisibility={() => handleToggleVisibility(review)}
            onDelete={() => handleDelete(review._id)}
          />
        ))}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-3xl bg-[#020617] rounded-[48px] border border-white/10 overflow-hidden shadow-2xl my-8"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-white">{editingReview._id ? "Edit Review" : "Add Review"}</h3>
                    <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">{editingReview.name || "Draft"}</p>
                  </div>
                </div>
                <button onClick={() => setEditingReview(null)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                  <XCircle className="w-5 h-5 text-text-muted" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#020617]">
                <div className="grid grid-cols-2 gap-8">
                  <InputField label="Customer Name" value={editingReview.name} onChange={(v: any) => setEditingReview({ ...editingReview, name: v })} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[2px] text-text-muted ml-1">Rating (1-5)</label>
                    <select
                      value={editingReview.rating}
                      onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                      className="admin-input w-full appearance-none bg-white/5"
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n} className="bg-[#020617]">{n} Stars</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-primary font-black text-xs uppercase tracking-[3px] border-l-4 border-primary pl-4">English</h4>
                    <InputField label="Role / Profession" value={editingReview.roleEn} onChange={(v: any) => setEditingReview({ ...editingReview, roleEn: v })} />
                    <InputField label="Review Text" value={editingReview.reviewEn} onChange={(v: any) => setEditingReview({ ...editingReview, reviewEn: v })} multiline />
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-secondary font-black text-xs uppercase tracking-[3px] border-l-4 border-secondary pl-4">Bangla</h4>
                    <InputField label="রোল / পেশা" value={editingReview.roleBn} onChange={(v: any) => setEditingReview({ ...editingReview, roleBn: v })} />
                    <InputField label="রিভিউ টেক্সট" value={editingReview.reviewBn} onChange={(v: any) => setEditingReview({ ...editingReview, reviewBn: v })} multiline />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <InputField label="Avatar Image URL" value={editingReview.image} onChange={(v: any) => setEditingReview({ ...editingReview, image: v })} placeholder="https://..." />
                </div>
              </div>

              <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/[0.01]">
                <button onClick={() => setEditingReview(null)} className="px-8 py-5 text-xs font-black uppercase text-text-muted tracking-widest">Cancel</button>
                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-light transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Publish Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewCard({ review, idx, onEdit, onToggleVisibility, onDelete }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className={`glass-card rounded-[40px] p-8 border-white/5 relative group hover:bg-white/[0.02] transition-all flex flex-col ${!review.visible ? "opacity-50 grayscale" : ""}`}
    >
      <div className="flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
          <img
            src={review.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.name}`}
            className="w-full h-full object-cover"
            alt={review.name}
          />
        </div>
        <div>
          <h4 className="text-lg font-black tracking-tight text-white">{review.name}</h4>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">{review.roleEn || "Customer"}</p>
          <div className="flex text-amber-500 mt-2 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "opacity-20"}`} />
            ))}
          </div>
        </div>
      </div>

      <p className="text-text-secondary text-sm font-medium italic leading-relaxed mb-8 flex-1">
        "{review.reviewEn}"
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <button
          onClick={onToggleVisibility}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${review.visible ? "bg-success/10 text-success border-success/20" : "bg-red-500/10 text-red-500 border-red-500/20"
            }`}
        >
          {review.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          {review.visible ? "Live" : "Hidden"}
        </button>

        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="w-10 h-10 rounded-xl bg-white/5 text-text-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10">
            <Edit3 className="w-4.5 h-4.5" />
          </button>
          <button onClick={onDelete} className="w-10 h-10 rounded-xl bg-white/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10">
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
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
