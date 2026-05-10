'use client';

import React, { useState } from 'react';
import { useProducts, useUpdateProduct, useDeleteProduct } from '@/hooks/useCMS';
import {
  Package, Plus, Edit3, Trash2, Eye, EyeOff, MoveUp, MoveDown, 
  Sparkles, Layers, Zap, MoreVertical, XCircle, GripVertical, Check, X,
  Layout, Type, Info, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { SortableList } from '../components/SortableList';

export default function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [activeEditorTab, setActiveEditorTab] = useState('general');

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

  const editorTabs = [
    { id: 'general', label: 'General Info', icon: Info },
    { id: 'plans', label: 'Pricing Plans', icon: Layers },
    { id: 'bullets', label: 'Bullet Points', icon: Type },
    { id: 'features', label: 'Comparison Features', icon: Sparkles },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Product Vault</h2>
          <p className="text-text-muted font-black uppercase text-[10px] tracking-[3px]">Manage premium packages and feature plans</p>
        </div>

        <button
          onClick={() => {
            setEditingProduct({
              titleEn: '', titleBn: '', subtitleEn: '', subtitleBn: '',
              badgeEn: 'Premium', badgeBn: 'প্রিমিয়াম',
              shortDescriptionEn: '', shortDescriptionBn: '',
              buttonTextEn: 'Buy Now', buttonTextBn: 'এখনই কিনুন',
              telegramLink: '', image: '', slug: '',
              plans: [], features: [], bulletPoints: [],
              visible: true, order: (products?.length || 0) + 1
            });
            setActiveEditorTab('general');
          }}
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary/10" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-72 flex-shrink-0">
                <div className="aspect-square rounded-[32px] bg-white/5 border border-white/10 overflow-hidden mb-6 relative group/img">
                  <img src={product.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" alt={product.titleEn} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">Status</span>
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${product.visible ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                    >
                      {product.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {product.visible ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>
              </div>

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
                      onClick={() => {
                        setEditingProduct(JSON.parse(JSON.stringify(product)));
                        setActiveEditorTab('general');
                      }}
                      className="w-14 h-14 rounded-2xl bg-white/5 text-text-muted hover:bg-primary hover:text-white transition-all flex items-center justify-center border border-white/10"
                    >
                      <Edit3 className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="w-14 h-14 rounded-2xl bg-white/5 text-text-muted hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-white/10"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4 text-secondary">
                      <Layers className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-[3px]">Plans</span>
                    </div>
                    <p className="text-3xl font-black">{product.plans?.length || 0}</p>
                  </div>
                  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4 text-success">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-[3px]">Features</span>
                    </div>
                    <p className="text-3xl font-black">{product.features?.length || 0}</p>
                  </div>
                  <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-3 mb-4 text-info">
                      <Zap className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-[3px]">Points</span>
                    </div>
                    <p className="text-3xl font-black">{product.bulletPoints?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Advanced Product Editor Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 bg-black/80 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-7xl bg-[#020617] rounded-[40px] lg:rounded-[60px] border border-white/10 overflow-hidden h-[95vh] flex flex-col shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-8 lg:px-12 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-black tracking-tighter">
                    {editingProduct._id ? 'Edit' : 'Create'} Product
                  </h3>
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mt-1">
                    {editingProduct.titleEn || 'New Package'} — <span className="text-primary">{activeEditorTab}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setEditingProduct(null)} 
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex overflow-hidden">
                {/* Editor Sidebar */}
                <aside className="w-20 lg:w-72 border-r border-white/5 bg-white/[0.01] p-4 lg:p-6 space-y-3">
                  {editorTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveEditorTab(tab.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          activeEditorTab === tab.id 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'text-text-muted hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                      </button>
                    );
                  })}
                </aside>

                {/* Editor Content */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeEditorTab}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      {activeEditorTab === 'general' && (
                        <div className="space-y-10">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Title (EN)</label>
                              <input 
                                className="admin-input w-full" 
                                value={editingProduct.titleEn} 
                                onChange={e => setEditingProduct({...editingProduct, titleEn: e.target.value})}
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Title (BN)</label>
                              <input 
                                className="admin-input w-full" 
                                value={editingProduct.titleBn} 
                                onChange={e => setEditingProduct({...editingProduct, titleBn: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Subtitle (EN)</label>
                              <input 
                                className="admin-input w-full" 
                                value={editingProduct.subtitleEn} 
                                onChange={e => setEditingProduct({...editingProduct, subtitleEn: e.target.value})}
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Subtitle (BN)</label>
                              <input 
                                className="admin-input w-full" 
                                value={editingProduct.subtitleBn} 
                                onChange={e => setEditingProduct({...editingProduct, subtitleBn: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1 flex items-center gap-2">
                                <LinkIcon className="w-3 h-3" /> Slug
                              </label>
                              <input 
                                className="admin-input w-full font-mono" 
                                value={editingProduct.slug} 
                                onChange={e => setEditingProduct({...editingProduct, slug: e.target.value})}
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1 flex items-center gap-2">
                                <ImageIcon className="w-3 h-3" /> Image URL
                              </label>
                              <input 
                                className="admin-input w-full" 
                                value={editingProduct.image} 
                                onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1 flex items-center gap-2">
                                <Zap className="w-3 h-3" /> Telegram
                              </label>
                              <input 
                                className="admin-input w-full" 
                                value={editingProduct.telegramLink} 
                                onChange={e => setEditingProduct({...editingProduct, telegramLink: e.target.value})}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[3px] ml-1">Short Description (EN)</label>
                            <textarea 
                              className="admin-input w-full min-h-[100px]" 
                              value={editingProduct.shortDescriptionEn} 
                              onChange={e => setEditingProduct({...editingProduct, shortDescriptionEn: e.target.value})}
                            />
                          </div>
                        </div>
                      )}

                      {activeEditorTab === 'plans' && (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black uppercase tracking-widest text-primary">Pricing Plans</h4>
                            <button 
                              onClick={() => {
                                const newPlan = { id: `plan-${Date.now()}`, nameEn: 'New Plan', nameBn: 'নতুন প্ল্যান', priceTk: 0, priceUsd: 0, duration: 'Monthly' };
                                setEditingProduct({...editingProduct, plans: [...(editingProduct.plans || []), newPlan]});
                              }}
                              className="bg-white/5 hover:bg-white/10 text-text-primary px-5 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                            >
                              <Plus className="w-4 h-4" /> Add Plan
                            </button>
                          </div>

                          <SortableList
                            items={editingProduct.plans || []}
                            idField="id"
                            onReorder={(newPlans) => setEditingProduct({...editingProduct, plans: newPlans})}
                            renderItem={(plan) => (
                              <div className="bg-white/[0.03] p-6 rounded-2xl border border-white/5 flex flex-col lg:flex-row gap-6 items-center">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <input 
                                    className="admin-input-sm" 
                                    placeholder="Name (EN)"
                                    value={plan.nameEn}
                                    onChange={e => {
                                      const newPlans = editingProduct.plans.map((p: any) => p.id === plan.id ? {...p, nameEn: e.target.value} : p);
                                      setEditingProduct({...editingProduct, plans: newPlans});
                                    }}
                                  />
                                  <input 
                                    className="admin-input-sm" 
                                    placeholder="Price (TK)"
                                    type="number"
                                    value={plan.priceTk}
                                    onChange={e => {
                                      const newPlans = editingProduct.plans.map((p: any) => p.id === plan.id ? {...p, priceTk: Number(e.target.value)} : p);
                                      setEditingProduct({...editingProduct, plans: newPlans});
                                    }}
                                  />
                                  <select 
                                    className="admin-input-sm"
                                    value={plan.duration}
                                    onChange={e => {
                                      const newPlans = editingProduct.plans.map((p: any) => p.id === plan.id ? {...p, duration: e.target.value} : p);
                                      setEditingProduct({...editingProduct, plans: newPlans});
                                    }}
                                  >
                                    <option>Monthly</option>
                                    <option>Yearly</option>
                                    <option>Lifetime</option>
                                  </select>
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => {
                                        const newPlans = editingProduct.plans.filter((p: any) => p.id !== plan.id);
                                        setEditingProduct({...editingProduct, plans: newPlans});
                                      }}
                                      className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          />
                        </div>
                      )}

                      {activeEditorTab === 'bullets' && (
                        <div className="space-y-8">
                           <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black uppercase tracking-widest text-primary">Bullet Points</h4>
                            <button 
                              onClick={() => {
                                const newPoint = { textEn: 'New Point', textBn: 'নতুন পয়েন্ট', visible: true, icon: 'Check', order: (editingProduct.bulletPoints?.length || 0) + 1 };
                                setEditingProduct({...editingProduct, bulletPoints: [...(editingProduct.bulletPoints || []), newPoint]});
                              }}
                              className="bg-white/5 hover:bg-white/10 text-text-primary px-5 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                            >
                              <Plus className="w-4 h-4" /> Add Point
                            </button>
                          </div>

                          <SortableList
                            items={(editingProduct.bulletPoints || []).map((p: any, i: number) => ({...p, id: `point-${i}`}))}
                            idField="id"
                            onReorder={(newPoints) => setEditingProduct({...editingProduct, bulletPoints: newPoints})}
                            renderItem={(point) => (
                              <div className="bg-white/[0.03] p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                <input 
                                  className="admin-input-sm flex-1" 
                                  value={point.textEn}
                                  onChange={e => {
                                    const newPoints = editingProduct.bulletPoints.map((p: any, idx: number) => `point-${idx}` === point.id ? {...p, textEn: e.target.value} : p);
                                    setEditingProduct({...editingProduct, bulletPoints: newPoints});
                                  }}
                                />
                                <button 
                                  onClick={() => {
                                    const newPoints = editingProduct.bulletPoints.filter((p: any, idx: number) => `point-${idx}` !== point.id);
                                    setEditingProduct({...editingProduct, bulletPoints: newPoints});
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          />
                        </div>
                      )}

                      {activeEditorTab === 'features' && (
                        <div className="space-y-8">
                           <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black uppercase tracking-widest text-primary">Comparison Features</h4>
                            <button 
                              onClick={() => {
                                const newFeature = { textEn: 'New Feature', textBn: 'নতুন ফিচার', visible: true, highlighted: false, order: (editingProduct.features?.length || 0) + 1, includedInPlanIds: [] };
                                setEditingProduct({...editingProduct, features: [...(editingProduct.features || []), newFeature]});
                              }}
                              className="bg-white/5 hover:bg-white/10 text-text-primary px-5 py-3 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                            >
                              <Plus className="w-4 h-4" /> Add Feature
                            </button>
                          </div>

                          <div className="space-y-4">
                            {(editingProduct.features || []).map((feature: any, fIdx: number) => (
                              <div key={fIdx} className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 space-y-6">
                                <div className="flex items-center gap-4">
                                  <input 
                                    className="admin-input flex-1" 
                                    value={feature.textEn}
                                    onChange={e => {
                                      const newFeatures = [...editingProduct.features];
                                      newFeatures[fIdx].textEn = e.target.value;
                                      setEditingProduct({...editingProduct, features: newFeatures});
                                    }}
                                  />
                                  <button 
                                    onClick={() => {
                                      const newFeatures = editingProduct.features.filter((_: any, i: number) => i !== fIdx);
                                      setEditingProduct({...editingProduct, features: newFeatures});
                                    }}
                                    className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                  {editingProduct.plans?.map((plan: any) => {
                                    const isIncluded = feature.includedInPlanIds?.includes(plan.id);
                                    return (
                                      <button
                                        key={plan.id}
                                        onClick={() => {
                                          const newFeatures = [...editingProduct.features];
                                          const planIds = newFeatures[fIdx].includedInPlanIds || [];
                                          if (isIncluded) {
                                            newFeatures[fIdx].includedInPlanIds = planIds.filter((id: string) => id !== plan.id);
                                          } else {
                                            newFeatures[fIdx].includedInPlanIds = [...planIds, plan.id];
                                          }
                                          setEditingProduct({...editingProduct, features: newFeatures});
                                        }}
                                        className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                          isIncluded ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-text-muted border-white/10'
                                        }`}
                                      >
                                        {isIncluded ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        {plan.nameEn}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 lg:p-12 border-t border-white/5 bg-white/[0.01] flex items-center justify-end gap-6">
                <button 
                  onClick={() => setEditingProduct(null)} 
                  className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateProduct(editingProduct);
                    setEditingProduct(null);
                  }}
                  className="bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:bg-primary-light transition-all"
                >
                  Save Full Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .admin-input {
          @apply bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all;
        }
        .admin-input-sm {
          @apply bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all;
        }
      `}</style>
    </div>
  );
}
