'use client';

import React, { useState } from 'react';
import { useProducts, useUpdateProduct, useDeleteProduct } from '@/hooks/useCMS';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
  Layers,
  Zap,
  MoreVertical,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleToggleVisibility = (product: any) => {
    updateProduct({ ...product, visible: !product.visible });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-xl animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Product Vault</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">Manage premium packages and feature plans</p>
        </div>

        <button
          onClick={() => setEditingProduct({
            titleEn: '', titleBn: '',
            plans: [], features: [], bulletPoints: [],
            visible: true, order: (products?.length || 0) + 1
          })}
          className="bg-primary hover:bg-primary-light text-white px-8 py-5 rounded-[28px] font-black uppercase text-xs tracking-widest transition-all glow-btn shadow-xl shadow-primary/20 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Create New Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-8">
        {products?.map((product: any, idx: number) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card rounded-[40px] p-8 lg:p-12 border-white/5 relative overflow-hidden group ${!product.visible ? 'opacity-60 grayscale' : ''}`}
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-10">
              {/* Product Image & Meta */}
              <div className="w-full lg:w-72 flex-shrink-0">
                <div className="aspect-square rounded-[32px] bg-white/5 border border-white/10 overflow-hidden mb-6 relative group/img">
                  <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt={product.titleEn} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-sm">
                    <button className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 transition-all"><Edit3 className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">Status</span>
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${product.visible ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}
                    >
                      {product.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {product.visible ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">Slug</span>
                    <span className="font-mono text-[11px] text-text-primary">/{product.slug}</span>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1 space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-[9px] font-black uppercase tracking-[3px] mb-3">
                      <Zap className="w-3 h-3 fill-primary" />
                      {product.badgeEn}
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4">{product.titleEn}</h3>
                    <p className="text-text-secondary text-lg font-medium max-w-2xl leading-relaxed opacity-80">{product.shortDescriptionEn}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="w-14 h-14 rounded-2xl bg-white/5 text-text-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10 group/edit"
                    >
                      <Edit3 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="w-14 h-14 rounded-2xl bg-white/5 text-text-muted hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                    <button className="w-14 h-14 rounded-2xl bg-white/5 text-text-muted hover:bg-white/10 transition-all flex items-center justify-center border border-white/10">
                      <MoreVertical className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Layers className="w-5 h-5 text-secondary" />
                      <span className="text-[10px] font-black uppercase tracking-[3px]">Plans</span>
                    </div>
                    <p className="text-3xl font-black">{product.plans?.length || 0}</p>
                  </div>
                  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Sparkles className="w-5 h-5 text-success" />
                      <span className="text-[10px] font-black uppercase tracking-[3px]">Features</span>
                    </div>
                    <p className="text-3xl font-black">{product.features?.length || 0}</p>
                  </div>
                  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Package className="w-5 h-5 text-info" />
                      <span className="text-[10px] font-black uppercase tracking-[3px]">Order</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-3xl font-black">{product.order}</p>
                      <div className="flex flex-col gap-1">
                        <button className="p-1 hover:text-primary transition-all"><MoveUp className="w-4 h-4" /></button>
                        <button className="p-1 hover:text-primary transition-all"><MoveDown className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Product Editor Modal (Simplified Placeholder) */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-5xl bg-bg-dark rounded-[60px] border border-white/10 overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-3xl font-black tracking-tighter">Edit Product: <span className="text-primary">{editingProduct.titleEn || 'New Product'}</span></h3>
                <button onClick={() => setEditingProduct(null)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"><XCircle className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Title (EN)</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      value={editingProduct.titleEn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, titleEn: e.target.value })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Title (BN)</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      value={editingProduct.titleBn}
                      onChange={(e) => setEditingProduct({ ...editingProduct, titleBn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Description (EN)</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[120px]"
                    value={editingProduct.shortDescriptionEn}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescriptionEn: e.target.value })}
                  />
                </div>

                <p className="text-text-muted font-bold text-sm italic">* Full feature & plan editing can be implemented using sub-forms and Draggable lists.</p>
              </div>

              <div className="p-10 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-6">
                <button onClick={() => setEditingProduct(null)} className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">Cancel</button>
                <button
                  onClick={() => {
                    updateProduct(editingProduct);
                    setEditingProduct(null);
                  }}
                  className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-light transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
