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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReviewsTab() {
  const { data: reviews, isLoading } = useReviews();
  const { mutate: updateReview } = useUpdateReview();
  const { mutate: deleteReview } = useDeleteReview();
  const [editingReview, setEditingReview] = useState<any>(null);

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
            Customer Reviews
          </h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">
            Manage social proof and testimonials
          </p>
        </div>

        <button
          onClick={() =>
            setEditingReview({
              name: "",
              commentEn: "",
              commentBn: "",
              rating: 5,
              avatar: "",
              professionEn: "",
              visible: true,
            })
          }
          className="bg-primary hover:bg-primary-light text-white px-8 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add Manual Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews?.map((review: any) => (
          <motion.div
            key={review._id}
            className={`glass-card rounded-[40px] p-8 border-white/5 relative group transition-all hover:bg-white/[0.02] ${!review.visible ? "opacity-50 grayscale" : ""}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                <img
                  src={
                    review.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                      review.name
                  }
                  className="w-full h-full object-cover"
                  alt={review.name}
                />
              </div>
              <div>
                <h4 className="font-black tracking-tight">{review.name}</h4>
                <div className="flex text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < review.rating ? "fill-warning" : "opacity-20"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-text-muted text-sm italic mb-8 line-clamp-3">
              "{review.commentEn}"
            </p>

            <div className="flex items-center justify-between border-t border-white/5 pt-6">
              <span
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${review.visible ? "bg-success/10 text-success border-success/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}
              >
                {review.visible ? "Published" : "Hidden"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingReview(review)}
                  className="p-2 text-text-muted hover:text-primary transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Delete?")) deleteReview(review._id);
                  }}
                  className="p-2 text-text-muted hover:text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingReview && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl bg-bg-dark rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tighter">
                  Edit Review
                </h3>
                <button
                  onClick={() => setEditingReview(null)}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                      Customer Name
                    </label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold"
                      value={editingReview.name}
                      onChange={(e) =>
                        setEditingReview({
                          ...editingReview,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold"
                      value={editingReview.rating}
                      onChange={(e) =>
                        setEditingReview({
                          ...editingReview,
                          rating: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">
                    Review Text (EN)
                  </label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold min-h-[100px]"
                    value={editingReview.commentEn}
                    onChange={(e) =>
                      setEditingReview({
                        ...editingReview,
                        commentEn: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="p-8 border-t border-white/5 flex justify-end gap-4">
                <button
                  onClick={() => setEditingReview(null)}
                  className="px-6 py-4 text-xs font-black uppercase text-text-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateReview(editingReview);
                    setEditingReview(null);
                  }}
                  className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest"
                >
                  Save Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
