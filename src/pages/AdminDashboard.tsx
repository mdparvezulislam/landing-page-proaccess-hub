import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
   useStore,
   HeroContent,
   Product,
   ProductPlan,
   Feature,
   FAQ,
   Review,
   PaymentMethod,
   GlobalFeature,
   TrustBadge,
   Order,
   PaymentSettings,
   SiteSettings,
   CountdownSettings,
   FooterSettings
} from '../store/useStore';
import {
   LayoutDashboard,
   Settings,
   Package,
   CreditCard,
   MessageSquare,
   HelpCircle,
   BarChart3,
   Plus,
   Trash2,
   Eye,
   EyeOff,
   GripVertical,
   ChevronRight,
   LogOut,
   Save,
   Check,
   X,
   Upload,
   Globe,
   Star,
   Users,
   TrendingUp,
   Wallet,
   Calendar,
   Smartphone,
   ShieldCheck,
   Zap,
   Bell,
   Clock,
   Search,
   Filter,
   ArrowLeft,
   Layers,
   MoreVertical,
   Sparkles
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

// --- Reusable UI Components ---

const Input = ({ label, value, onChange, placeholder, type = "text", mono = false }: any) => (
   <div className="space-y-2">
      <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">{label}</label>
      <input
         type={type}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className={`w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-bold ${mono ? 'font-mono' : ''}`}
      />
   </div>
);

const TextArea = ({ label, value, onChange, placeholder }: any) => (
   <div className="space-y-2">
      <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">{label}</label>
      <textarea
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium"
      />
   </div>
);

const SortableItem = ({ id, children }: any) => {
   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
   const style = { transform: CSS.Transform.toString(transform), transition };
   return (
      <div ref={setNodeRef} style={style} className="relative group">
         <div {...attributes} {...listeners} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-2 bg-white/10 rounded-lg transition-all z-10">
            <GripVertical className="w-4 h-4 text-text-muted" />
         </div>
         {children}
      </div>
   );
};

// --- Tabs ---

const AnalyticsTab = ({ orders }: { orders: Order[] }) => {
   const completedOrders = orders.filter(o => o.status === 'Completed');
   const totalRevenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);
   const pendingCount = orders.filter(o => o.status === 'Pending').length;
   const totalCount = orders.length;

   const stats = [
      { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} TK`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
      { label: 'Pending Orders', value: pendingCount.toString(), icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
      { label: 'Total Orders', value: totalCount.toString(), icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
      { label: 'Active Users', value: '1,240', icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
   ];

   return (
      <div className="space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
               <div key={i} className="glass-card p-8 rounded-[32px] border-white/5">
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-2 block">{stat.label}</span>
                  <span className="text-3xl font-black text-text-primary tracking-tighter">{stat.value}</span>
               </div>
            ))}
         </div>

         <div className="glass-card rounded-[40px] border-white/5 overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-xl font-black">Recent Activity</h3>
            </div>
            <div className="p-20 text-center text-text-muted font-bold italic">
               Analytics visualization coming soon...
            </div>
         </div>
      </div>
   );
};

const OrdersTab = ({ orders, updateOrderStatus, deleteOrder }: { orders: Order[], updateOrderStatus: any, deleteOrder: any }) => {
   const [filter, setFilter] = useState('All');
   const [search, setSearch] = useState('');

   const filteredOrders = orders.filter(o => {
      const matchesFilter = filter === 'All' || o.status === filter;
      const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
         o.transactionId.toLowerCase().includes(search.toLowerCase()) ||
         o.telegramUsername.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
   });

   return (
      <div className="space-y-10">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/5 p-10 rounded-[48px] border border-white/10">
            <div>
               <h3 className="text-3xl font-black tracking-tighter">Orders</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px] mt-2">Manage customer transactions</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                     type="text"
                     placeholder="Search orders..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                  />
               </div>
               <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                  {['All', 'Pending', 'Completed', 'Rejected'].map((f) => (
                     <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="glass-card rounded-[40px] border-white/5 overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/[0.03] text-[10px] font-black text-text-muted uppercase tracking-[3px] border-b border-white/5">
                     <th className="px-10 py-6">Customer</th>
                     <th className="px-10 py-6">Plan</th>
                     <th className="px-10 py-6">Transaction</th>
                     <th className="px-10 py-6">Status</th>
                     <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                     <tr><td colSpan={5} className="p-20 text-center text-text-muted font-bold">No orders found.</td></tr>
                  ) : (
                     filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-white/[0.01] group">
                           <td className="px-10 py-8">
                              <div className="flex flex-col">
                                 <span className="font-black text-text-primary">{order.customerName}</span>
                                 <span className="text-xs text-primary font-bold">@{order.telegramUsername}</span>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex flex-col">
                                 <span className="text-sm font-black text-text-primary">{order.productName}</span>
                                 <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{order.plan} - {order.amount} TK</span>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex flex-col">
                                 <span className="text-xs font-black text-success uppercase select-all">{order.transactionId}</span>
                                 <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">via {order.paymentNumber}</span>
                              </div>
                           </td>
                           <td className="px-10 py-8">
                              <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${order.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                                 order.status === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
                                    'bg-red-500/10 text-red-400 border-red-500/20'
                                 }`}>
                                 {order.status}
                              </span>
                           </td>
                           <td className="px-10 py-8">
                              <div className="flex items-center justify-end gap-3">
                                 {order.status === 'Pending' && (
                                    <>
                                       <button onClick={() => updateOrderStatus(order.id, 'Completed')} className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center hover:bg-success hover:text-white transition-all"><Check className="w-5 h-5" /></button>
                                       <button onClick={() => updateOrderStatus(order.id, 'Rejected')} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
                                    </>
                                 )}
                                 <button onClick={() => deleteOrder(order.id)} className="w-10 h-10 rounded-xl bg-white/5 text-text-muted flex items-center justify-center hover:bg-red-500/10 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                              </div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

const HeroTab = ({ hero, updateHero }: { hero: HeroContent, updateHero: any }) => {
   return (
      <div className="space-y-10 max-w-5xl">
         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
               <LayoutDashboard className="w-8 h-8 text-primary" />
               <h3 className="text-2xl font-black">Hero Section CMS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Badge (EN)" value={hero.badgeEn} onChange={(v: any) => updateHero({ ...hero, badgeEn: v })} />
               <Input label="Badge (BN)" value={hero.badgeBn} onChange={(v: any) => updateHero({ ...hero, badgeBn: v })} />
               <Input label="Title (EN)" value={hero.titleEn} onChange={(v: any) => updateHero({ ...hero, titleEn: v })} />
               <Input label="Title (BN)" value={hero.titleBn} onChange={(v: any) => updateHero({ ...hero, titleBn: v })} />
               <Input label="Title Accent (EN)" value={hero.titleAccentEn} onChange={(v: any) => updateHero({ ...hero, titleAccentEn: v })} />
               <Input label="Title Accent (BN)" value={hero.titleAccentBn} onChange={(v: any) => updateHero({ ...hero, titleAccentBn: v })} />
               <Input label="Subtitle (EN)" value={hero.subtitleEn} onChange={(v: any) => updateHero({ ...hero, subtitleEn: v })} />
               <Input label="Subtitle (BN)" value={hero.subtitleBn} onChange={(v: any) => updateHero({ ...hero, subtitleBn: v })} />
            </div>

            <TextArea label="Description (EN)" value={hero.descriptionEn} onChange={(v: any) => updateHero({ ...hero, descriptionEn: v })} />
            <TextArea label="Description (BN)" value={hero.descriptionBn} onChange={(v: any) => updateHero({ ...hero, descriptionBn: v })} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="CTA 1 Text (EN)" value={hero.cta1En} onChange={(v: any) => updateHero({ ...hero, cta1En: v })} />
               <Input label="CTA 1 Text (BN)" value={hero.cta1Bn} onChange={(v: any) => updateHero({ ...hero, cta1Bn: v })} />
               <Input label="CTA 2 Text (EN)" value={hero.cta2En} onChange={(v: any) => updateHero({ ...hero, cta2En: v })} />
               <Input label="CTA 2 Text (BN)" value={hero.cta2Bn} onChange={(v: any) => updateHero({ ...hero, cta2Bn: v })} />
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
               <h4 className="text-sm font-black uppercase tracking-widest text-primary">Stats Grid</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hero.stats.map((stat, i) => (
                     <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                        <Input label={`Value ${i + 1} (EN)`} value={stat.valueEn} onChange={(v: any) => {
                           const newStats = [...hero.stats];
                           newStats[i].valueEn = v;
                           updateHero({ ...hero, stats: newStats });
                        }} />
                        <Input label={`Label ${i + 1} (EN)`} value={stat.labelEn} onChange={(v: any) => {
                           const newStats = [...hero.stats];
                           newStats[i].labelEn = v;
                           updateHero({ ...hero, stats: newStats });
                        }} />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

const ProductsTab = ({ products, updateProduct, deleteProduct, addProduct }: any) => {
   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <h3 className="text-2xl font-black">Products</h3>
            <button
               onClick={() => addProduct({
                  id: Date.now().toString(),
                  titleEn: 'New Product',
                  titleBn: 'নতুন পণ্য',
                  subtitleEn: '',
                  subtitleBn: '',
                  badgeEn: 'New',
                  badgeBn: 'নতুন',
                  shortDescriptionEn: '',
                  shortDescriptionBn: '',
                  buttonTextEn: 'Buy Now',
                  buttonTextBn: 'কিনুন',
                  telegramLink: '',
                  image: '',
                  visible: true,
                  order: products.length + 1,
                  plans: [],
                  bulletPoints: [],
                  features: []
               })}
               className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg"
            >
               <Plus className="w-5 h-5" /> Add Product
            </button>
         </div>

         <div className="grid grid-cols-1 gap-8">
            {products.sort((a: any, b: any) => a.order - b.order).map((p: Product) => (
               <div key={p.id} className="glass-card p-10 rounded-[48px] border-white/5 space-y-10">
                  <div className="flex justify-between items-center border-b border-white/5 pb-8">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                           {p.image && <img src={p.image} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                           <h4 className="text-2xl font-black">{p.titleEn}</h4>
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest">{p.badgeEn}</span>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={() => updateProduct(p.id, { ...p, visible: !p.visible })} className={`p-4 rounded-2xl ${p.visible ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'}`}>
                           {p.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button onClick={() => deleteProduct(p.id)} className="p-4 bg-red-500/10 text-red-400 rounded-2xl"><Trash2 className="w-5 h-5" /></button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <Input label="Title (EN)" value={p.titleEn} onChange={(v: any) => updateProduct(p.id, { ...p, titleEn: v })} />
                     <Input label="Title (BN)" value={p.titleBn} onChange={(v: any) => updateProduct(p.id, { ...p, titleBn: v })} />
                     <Input label="Badge (EN)" value={p.badgeEn} onChange={(v: any) => updateProduct(p.id, { ...p, badgeEn: v })} />
                     <Input label="Badge (BN)" value={p.badgeBn} onChange={(v: any) => updateProduct(p.id, { ...p, badgeBn: v })} />
                     <Input label="Image URL" value={p.image} onChange={(v: any) => updateProduct(p.id, { ...p, image: v })} />
                     <Input label="Telegram Link" value={p.telegramLink} onChange={(v: any) => updateProduct(p.id, { ...p, telegramLink: v })} />
                  </div>

                  <div className="space-y-6 pt-10 border-t border-white/5">
                     <div className="flex justify-between items-center">
                        <h5 className="text-xs font-black uppercase tracking-widest text-text-muted">Pricing Plans</h5>
                        <button
                           onClick={() => {
                              const newPlans = [...p.plans, { id: Date.now().toString(), nameEn: 'New Plan', nameBn: 'নতুন প্ল্যান', priceTk: 0, duration: 'Monthly' }];
                              updateProduct(p.id, { ...p, plans: newPlans });
                           }}
                           className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2"
                        >
                           <Plus className="w-4 h-4" /> Add Plan
                        </button>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {p.plans.map((plan: any, idx: number) => (
                           <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative group">
                              <button
                                 onClick={() => {
                                    const newPlans = p.plans.filter((_: any, i: number) => i !== idx);
                                    updateProduct(p.id, { ...p, plans: newPlans });
                                 }}
                                 className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-10"
                              >
                                 <X className="w-4 h-4" />
                              </button>
                              <div className="grid grid-cols-2 gap-3">
                                 <Input label="Name (EN)" value={plan.nameEn} onChange={(v: any) => {
                                    const newPlans = [...p.plans];
                                    newPlans[idx].nameEn = v;
                                    updateProduct(p.id, { ...p, plans: newPlans });
                                 }} />
                                 <Input label="Name (BN)" value={plan.nameBn} onChange={(v: any) => {
                                    const newPlans = [...p.plans];
                                    newPlans[idx].nameBn = v;
                                    updateProduct(p.id, { ...p, plans: newPlans });
                                 }} />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                 <Input label="Price (TK)" value={plan.priceTk} onChange={(v: any) => {
                                    const newPlans = [...p.plans];
                                    newPlans[idx].priceTk = Number(v);
                                    updateProduct(p.id, { ...p, plans: newPlans });
                                 }} />
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Duration</label>
                                    <select
                                       value={plan.duration}
                                       onChange={(e) => {
                                          const newPlans = [...p.plans];
                                          newPlans[idx].duration = e.target.value;
                                          updateProduct(p.id, { ...p, plans: newPlans });
                                       }}
                                       className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all"
                                    >
                                       <option value="Monthly">Monthly</option>
                                       <option value="Yearly">Yearly</option>
                                       <option value="Lifetime">Lifetime</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <h5 className="text-xs font-black uppercase tracking-widest text-text-muted">Bullet Points</h5>
                           <button
                              onClick={() => {
                                 const newBps = [...p.bulletPoints, { id: Date.now().toString(), textEn: 'New Point', textBn: 'নতুন পয়েন্ট', visible: true, order: p.bulletPoints.length + 1 }];
                                 updateProduct(p.id, { ...p, bulletPoints: newBps });
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-success flex items-center gap-2"
                           >
                              <Plus className="w-4 h-4" /> Add Point
                           </button>
                        </div>
                        <div className="space-y-3">
                           {p.bulletPoints.map((bp: any, idx: number) => (
                              <div key={idx} className="flex gap-3 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                 <div className="flex-1 grid grid-cols-2 gap-3">
                                    <input value={bp.textEn} onChange={(e) => {
                                       const newBps = [...p.bulletPoints];
                                       newBps[idx].textEn = e.target.value;
                                       updateProduct(p.id, { ...p, bulletPoints: newBps });
                                    }} className="bg-transparent text-sm focus:outline-none border-b border-white/10" placeholder="EN" />
                                    <input value={bp.textBn} onChange={(e) => {
                                       const newBps = [...p.bulletPoints];
                                       newBps[idx].textBn = e.target.value;
                                       updateProduct(p.id, { ...p, bulletPoints: newBps });
                                    }} className="bg-transparent text-sm focus:outline-none border-b border-white/10" placeholder="BN" />
                                 </div>
                                 <button onClick={() => {
                                    const newBps = [...p.bulletPoints];
                                    newBps[idx].visible = !newBps[idx].visible;
                                    updateProduct(p.id, { ...p, bulletPoints: newBps });
                                 }} className={`p-2 rounded-lg ${bp.visible ? 'text-success' : 'text-text-muted'}`}>
                                    {bp.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                 </button>
                                 <button onClick={() => {
                                    const newBps = p.bulletPoints.filter((_: any, i: number) => i !== idx);
                                    updateProduct(p.id, { ...p, bulletPoints: newBps });
                                 }} className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <h5 className="text-xs font-black uppercase tracking-widest text-text-muted">Comparison Features</h5>
                           <button
                              onClick={() => {
                                 const newFeatures = [...p.features, { id: Date.now().toString(), textEn: 'New Feature', textBn: 'নতুন ফিচার', visible: true, highlighted: false, order: p.features.length + 1 }];
                                 updateProduct(p.id, { ...p, features: newFeatures });
                              }}
                              className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-2"
                           >
                              <Plus className="w-4 h-4" /> Add Feature
                           </button>
                        </div>
                        <div className="space-y-4">
                           {p.features.map((f: any, idx: number) => (
                              <div key={idx} className="bg-white/5 p-6 rounded-[32px] border border-white/5 space-y-6">
                                 <div className="flex gap-3 items-center">
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                       <input value={f.textEn} onChange={(e) => {
                                          const newFeatures = [...p.features];
                                          newFeatures[idx].textEn = e.target.value;
                                          updateProduct(p.id, { ...p, features: newFeatures });
                                       }} className="bg-transparent text-sm font-bold focus:outline-none border-b border-white/10 p-2" placeholder="Feature (EN)" />
                                       <input value={f.textBn} onChange={(e) => {
                                          const newFeatures = [...p.features];
                                          newFeatures[idx].textBn = e.target.value;
                                          updateProduct(p.id, { ...p, features: newFeatures });
                                       }} className="bg-transparent text-sm font-bold focus:outline-none border-b border-white/10 p-2" placeholder="Feature (BN)" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                       <button onClick={() => {
                                          const newFeatures = [...p.features];
                                          newFeatures[idx].highlighted = !newFeatures[idx].highlighted;
                                          updateProduct(p.id, { ...p, features: newFeatures });
                                       }} className={`p-2.5 rounded-xl transition-all ${f.highlighted ? 'bg-primary/20 text-primary' : 'bg-white/5 text-text-muted'}`}>
                                          <Sparkles className="w-4 h-4" />
                                       </button>
                                       <button onClick={() => {
                                          const newFeatures = [...p.features];
                                          newFeatures[idx].visible = !newFeatures[idx].visible;
                                          updateProduct(p.id, { ...p, features: newFeatures });
                                       }} className={`p-2.5 rounded-xl transition-all ${f.visible ? 'bg-success/20 text-success' : 'bg-white/5 text-text-muted'}`}>
                                          {f.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                       </button>
                                       <button onClick={() => {
                                          const newFeatures = p.features.filter((_: any, i: number) => i !== idx);
                                          updateProduct(p.id, { ...p, features: newFeatures });
                                       }} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                                          <Trash2 className="w-4 h-4" />
                                       </button>
                                    </div>
                                 </div>

                                 {/* Plan Selection for this Feature */}
                                 <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest w-full mb-1">Available In Plans:</span>
                                    {p.plans.map((plan: any) => {
                                       const isIncluded = (f.includedInPlanIds || []).includes(plan.id);
                                       return (
                                          <button
                                             key={plan.id}
                                             onClick={() => {
                                                const newFeatures = [...p.features];
                                                const currentIds = f.includedInPlanIds || [];
                                                newFeatures[idx].includedInPlanIds = isIncluded
                                                   ? currentIds.filter((id: string) => id !== plan.id)
                                                   : [...currentIds, plan.id];
                                                updateProduct(p.id, { ...p, features: newFeatures });
                                             }}
                                             className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${isIncluded ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/5 text-text-muted hover:border-white/20'
                                                }`}
                                          >
                                             {plan.nameEn}
                                          </button>
                                       );
                                    })}
                                    {p.plans.length === 0 && <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest">No plans added yet</span>}
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

const PaymentsTab = ({ paymentSettings, updatePaymentSettings }: any) => {
   const addMethod = () => {
      const newMethods = [...paymentSettings.methods, {
         id: Date.now().toString(),
         name: 'New Method',
         number: '',
         accountTypeEn: 'Personal',
         accountTypeBn: 'পার্সোনাল',
         qrCode: '',
         color: '#7C3AED',
         enabled: true,
         order: paymentSettings.methods.length + 1
      }];
      updatePaymentSettings({ ...paymentSettings, methods: newMethods });
   };

   return (
      <div className="space-y-10 max-w-5xl">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <h3 className="text-2xl font-black">Payment Settings</h3>
            <button onClick={addMethod} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg">
               <Plus className="w-5 h-5" /> Add Method
            </button>
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
            <Input label="Warning Text (EN)" value={paymentSettings.warningTextEn} onChange={(v: any) => updatePaymentSettings({ ...paymentSettings, warningTextEn: v })} />
            <Input label="Warning Text (BN)" value={paymentSettings.warningTextBn} onChange={(v: any) => updatePaymentSettings({ ...paymentSettings, warningTextBn: v })} />

            <div className="space-y-6 pt-10 border-t border-white/5">
               <h4 className="text-sm font-black uppercase tracking-widest text-primary">Methods</h4>
               <div className="grid grid-cols-1 gap-6">
                  {paymentSettings.methods.map((m: PaymentMethod, i: number) => (
                     <div key={m.id} className="p-8 rounded-[32px] bg-white/5 border border-white/10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-3">
                           <Input label="Name" value={m.name} onChange={(v: any) => {
                              const newMethods = [...paymentSettings.methods];
                              newMethods[i].name = v;
                              updatePaymentSettings({ ...paymentSettings, methods: newMethods });
                           }} />
                        </div>
                        <div className="md:col-span-3">
                           <Input label="Number" value={m.number} onChange={(v: any) => {
                              const newMethods = [...paymentSettings.methods];
                              newMethods[i].number = v;
                              updatePaymentSettings({ ...paymentSettings, methods: newMethods });
                           }} />
                        </div>
                        <div className="md:col-span-4">
                           <Input label="QR Code URL" value={m.qrCode} onChange={(v: any) => {
                              const newMethods = [...paymentSettings.methods];
                              newMethods[i].qrCode = v;
                              updatePaymentSettings({ ...paymentSettings, methods: newMethods });
                           }} />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2">
                           <button
                              onClick={() => {
                                 const newMethods = paymentSettings.methods.filter((met: any) => met.id !== m.id);
                                 updatePaymentSettings({ ...paymentSettings, methods: newMethods });
                              }}
                              className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                           >
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

const FeaturesTab = ({ featuresSection, updateFeaturesSection, globalFeatures, updateGlobalFeature, deleteGlobalFeature, addGlobalFeature }: any) => {
   return (
      <div className="space-y-10 max-w-5xl">
         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
            <h3 className="text-2xl font-black pb-6 border-b border-white/5">Features Section Heading</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Title (EN)" value={featuresSection.titleEn} onChange={(v: any) => updateFeaturesSection({ ...featuresSection, titleEn: v })} />
               <Input label="Title (BN)" value={featuresSection.titleBn} onChange={(v: any) => updateFeaturesSection({ ...featuresSection, titleBn: v })} />
            </div>
            <TextArea label="Description (EN)" value={featuresSection.descriptionEn} onChange={(v: any) => updateFeaturesSection({ ...featuresSection, descriptionEn: v })} />
            <TextArea label="Description (BN)" value={featuresSection.descriptionBn} onChange={(v: any) => updateFeaturesSection({ ...featuresSection, descriptionBn: v })} />
         </div>

         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <h3 className="text-2xl font-black">Individual Features</h3>
            <button
               onClick={() => addGlobalFeature({
                  id: Date.now().toString(),
                  titleEn: 'New Feature',
                  titleBn: 'নতুন ফিচার',
                  descriptionEn: '',
                  descriptionBn: '',
                  icon: 'Zap',
                  visible: true,
                  order: globalFeatures.length + 1
               })}
               className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2"
            >
               <Plus className="w-5 h-5" /> Add Feature
            </button>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {globalFeatures.sort((a: any, b: any) => a.order - b.order).map((f: any) => (
               <div key={f.id} className="glass-card p-8 rounded-[32px] border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                           <Zap className="w-5 h-5" />
                        </div>
                        <h4 className="font-black">{f.titleEn}</h4>
                     </div>
                     <button onClick={() => deleteGlobalFeature(f.id)} className="text-red-400"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input label="Title (EN)" value={f.titleEn} onChange={(v: any) => updateGlobalFeature(f.id, { ...f, titleEn: v })} />
                     <Input label="Title (BN)" value={f.titleBn} onChange={(v: any) => updateGlobalFeature(f.id, { ...f, titleBn: v })} />
                  </div>
                  <TextArea label="Description (EN)" value={f.descriptionEn} onChange={(v: any) => updateGlobalFeature(f.id, { ...f, descriptionEn: v })} />
               </div>
            ))}
         </div>
      </div>
   );
};

const ReviewsTab = ({ reviews, updateReview, deleteReview, addReview }: any) => {
   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <h3 className="text-2xl font-black">Reviews</h3>
            <button
               onClick={() => addReview({
                  id: Date.now().toString(),
                  name: 'New Reviewer',
                  roleEn: 'VIP Member',
                  roleBn: 'ভিআইপি মেম্বার',
                  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random(),
                  rating: 5,
                  reviewEn: 'Great service!',
                  reviewBn: 'অসাধারণ সার্ভিস!',
                  featured: true,
                  visible: true,
                  order: reviews.length + 1
               })}
               className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2"
            >
               <Plus className="w-5 h-5" /> Add Review
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r: any) => (
               <div key={r.id} className="glass-card p-8 rounded-[32px] border-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <img src={r.image} className="w-12 h-12 rounded-xl" />
                        <h4 className="font-black">{r.name}</h4>
                     </div>
                     <button onClick={() => deleteReview(r.id)} className="text-red-400"><Trash2 className="w-5 h-5" /></button>
                  </div>
                  <Input label="Name" value={r.name} onChange={(v: any) => updateReview(r.id, { ...r, name: v })} />
                  <Input label="Review (EN)" value={r.reviewEn} onChange={(v: any) => updateReview(r.id, { ...r, reviewEn: v })} />
                  <Input label="Review (BN)" value={r.reviewBn} onChange={(v: any) => updateReview(r.id, { ...r, reviewBn: v })} />
               </div>
            ))}
         </div>
      </div>
   );
};

const FAQTab = ({ faqs, updateFAQ, deleteFAQ, addFAQ }: any) => {
   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <h3 className="text-2xl font-black">FAQs</h3>
            <button
               onClick={() => addFAQ({
                  id: Date.now().toString(),
                  qEn: 'New Question',
                  qBn: 'নতুন প্রশ্ন',
                  aEn: 'Answer...',
                  aBn: 'উত্তর...',
                  visible: true,
                  order: faqs.length + 1
               })}
               className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2"
            >
               <Plus className="w-5 h-5" /> Add FAQ
            </button>
         </div>
         <div className="space-y-4">
            {faqs.map((f: any) => (
               <div key={f.id} className="glass-card p-8 rounded-[32px] border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                     <h4 className="font-black">{f.qEn}</h4>
                     <button onClick={() => deleteFAQ(f.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <Input label="Question (EN)" value={f.qEn} onChange={(v: any) => updateFAQ(f.id, { ...f, qEn: v })} />
                  <TextArea label="Answer (EN)" value={f.aEn} onChange={(v: any) => updateFAQ(f.id, { ...f, aEn: v })} />
               </div>
            ))}
         </div>
      </div>
   );
};

const SettingsTab = ({ settings, updateSettings, countdown, updateCountdown }: any) => {
   return (
      <div className="space-y-10 max-w-5xl">
         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
            <h3 className="text-2xl font-black pb-6 border-b border-white/5">Site Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Site Name (EN)" value={settings.siteNameEn} onChange={(v: any) => updateSettings({ ...settings, siteNameEn: v })} />
               <Input label="Site Name (BN)" value={settings.siteNameBn} onChange={(v: any) => updateSettings({ ...settings, siteNameBn: v })} />
               <Input label="Telegram Link" value={settings.telegramLink} onChange={(v: any) => updateSettings({ ...settings, telegramLink: v })} />
               <Input label="Telegram Handle" value={settings.telegramHandle} onChange={(v: any) => updateSettings({ ...settings, telegramHandle: v })} />
            </div>
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
               <h3 className="text-2xl font-black">Countdown Timer</h3>
               <button
                  onClick={() => updateCountdown({ ...countdown, enabled: !countdown.enabled })}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${countdown.enabled ? 'bg-primary text-white' : 'bg-white/5 text-text-muted'}`}
               >
                  {countdown.enabled ? 'ENABLED' : 'DISABLED'}
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Target Date (ISO)" value={countdown.targetDate} onChange={(v: any) => updateCountdown({ ...countdown, targetDate: v })} placeholder="2026-12-31T23:59:59" />
               <Input label="Title (EN)" value={countdown.titleEn} onChange={(v: any) => updateCountdown({ ...countdown, titleEn: v })} />
               <Input label="Title (BN)" value={countdown.titleBn} onChange={(v: any) => updateCountdown({ ...countdown, titleBn: v })} />
            </div>
         </div>
      </div>
   );
};

// --- Main Dashboard ---

export const AdminDashboard = () => {
   const [activeTab, setActiveTab] = useState('analytics');
   const {
      isAdmin, setAdminStatus,
      hero, updateHero,
      featuresSection, updateFeaturesSection,
      products, updateProduct, deleteProduct, addProduct,
      faqs, updateFAQ, deleteFAQ, addFAQ,
      reviews, updateReview, deleteReview, addReview,
      orders, updateOrderStatus, deleteOrder,
      paymentSettings, updatePaymentSettings,
      settings, updateSettings,
      countdown, updateCountdown,
      globalFeatures, updateGlobalFeature, deleteGlobalFeature, addGlobalFeature,
      trustBadges, updateTrustBadge, deleteTrustBadge, addTrustBadge
   } = useStore();

   useEffect(() => {
      if (!isAdmin) {
         const key = prompt('Enter Admin Key:');
         if (key === 'pro_access_23') {
            setAdminStatus(true);
            toast.success('Admin access granted');
         } else {
            window.location.href = '/';
         }
      }
   }, [isAdmin]);

   if (!isAdmin) return null;

   const tabs = [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'orders', label: 'Orders', icon: CreditCard },
      { id: 'hero', label: 'Hero', icon: LayoutDashboard },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'features', label: 'Features', icon: Layers },
      { id: 'payments', label: 'Payments', icon: Wallet },
      { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'faq', label: 'FAQ', icon: HelpCircle },
      { id: 'settings', label: 'Settings', icon: Settings },
   ];

   return (
      <div className="min-h-screen bg-[#020617] flex">
         {/* Sidebar */}
         <aside className="w-80 h-screen sticky top-0 bg-[#05091D] border-r border-white/5 p-8 flex flex-col hidden lg:flex">
            <div className="flex items-center gap-4 mb-12">
               <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black">A</div>
               <h1 className="font-black text-xl tracking-tighter">Admin Panel</h1>
            </div>
            <nav className="space-y-2 flex-1 overflow-y-auto">
               {tabs.map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
                  >
                     <tab.icon className="w-5 h-5" />
                     {tab.label}
                  </button>
               ))}
            </nav>
            <button
               onClick={() => { setAdminStatus(false); window.location.href = '/'; }}
               className="mt-8 flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all border border-red-400/10"
            >
               <LogOut className="w-5 h-5" /> Logout
            </button>
         </aside>

         {/* Mobile Bottom Nav */}
         <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#05091D] border-t border-white/10 z-[100] flex items-center justify-around px-2">
            {tabs.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 ${activeTab === tab.id ? 'text-primary' : 'text-text-muted'}`}
               >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-[7px] font-black uppercase">{tab.label}</span>
               </button>
            ))}
         </div>

         {/* Main Content */}
         <main className="flex-1 p-6 lg:p-16 pb-32 lg:pb-16 overflow-y-auto">
            <header className="mb-12 flex justify-between items-center">
               <div>
                  <h2 className="text-4xl font-black tracking-tighter capitalize">{activeTab}</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px] mt-2">Manage your platform resources</p>
               </div>
            </header>

            <AnimatePresence mode="wait">
               <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
               >
                  {activeTab === 'analytics' && <AnalyticsTab orders={orders} />}
                  {activeTab === 'orders' && <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} />}
                  {activeTab === 'hero' && <HeroTab hero={hero} updateHero={updateHero} />}
                  {activeTab === 'products' && <ProductsTab products={products} updateProduct={updateProduct} deleteProduct={deleteProduct} addProduct={addProduct} />}
                  {activeTab === 'features' && <FeaturesTab featuresSection={featuresSection} updateFeaturesSection={updateFeaturesSection} globalFeatures={globalFeatures} updateGlobalFeature={updateGlobalFeature} deleteGlobalFeature={deleteGlobalFeature} addGlobalFeature={addGlobalFeature} />}
                  {activeTab === 'payments' && <PaymentsTab paymentSettings={paymentSettings} updatePaymentSettings={updatePaymentSettings} />}
                  {activeTab === 'reviews' && <ReviewsTab reviews={reviews} updateReview={updateReview} deleteReview={deleteReview} addReview={addReview} />}
                  {activeTab === 'faq' && <FAQTab faqs={faqs} updateFAQ={updateFAQ} deleteFAQ={deleteFAQ} addFAQ={addFAQ} />}
                  {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} countdown={countdown} updateCountdown={updateCountdown} />}
               </motion.div>
            </AnimatePresence>
         </main>
      </div>
   );
};
