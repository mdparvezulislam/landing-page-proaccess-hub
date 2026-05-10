import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, HeroContent, Product, ProductPlan, Feature, FAQ, Review, PaymentMethod } from '../store/useStore';
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
   ShieldCheck
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

// --- Admin Components ---

const Sidebar = ({ activeTab, setActiveTab, onLogout }: any) => {
   const menuItems = [
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'orders', label: 'Orders', icon: CreditCard },
      { id: 'hero', label: 'Hero Section', icon: LayoutDashboard },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'pricing', label: 'Comparison', icon: BarChart3 },
      { id: 'payments', label: 'Payments', icon: Wallet },
      { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'faq', label: 'FAQ', icon: HelpCircle },
      { id: 'settings', label: 'Settings', icon: Settings },
   ];

   return (
      <aside className="w-80 h-screen sticky top-0 bg-[#05091D] border-r border-white/5 p-8 flex flex-col">
         <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black">A</div>
            <div>
               <h1 className="font-black text-lg leading-none">Admin Panel</h1>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">VIP Hub Console</span>
            </div>
         </div>

         <nav className="space-y-2 flex-1">
            {menuItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all group ${activeTab === item.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/20'
                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                     }`}
               >
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
                  {item.label}
               </button>
            ))}
         </nav>

         <button
            onClick={onLogout}
            className="mt-8 flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all border border-red-400/10"
         >
            <LogOut className="w-5 h-5" />
            Logout
         </button>
      </aside>
   );
};

// Sortable Item Wrapper
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

const OrdersTab = ({ orders, updateOrder, deleteOrder }: any) => {
   const [filter, setFilter] = useState('All');
   const [search, setSearch] = useState('');

   const filteredOrders = orders.filter((o: any) => {
      const matchesFilter = filter === 'All' || o.status === filter;
      const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                           o.transactionId.toLowerCase().includes(search.toLowerCase()) ||
                           o.telegramUsername?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
   });

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'Completed': return 'bg-success/10 text-success border-success/20';
         case 'Pending': return 'bg-warning/10 text-warning border-warning/20';
         case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
         default: return 'bg-white/5 text-text-muted border-white/10';
      }
   };

   return (
      <div className="space-y-10">
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/5 p-10 rounded-[48px] border border-white/10">
            <div>
               <h3 className="text-3xl font-black tracking-tighter">Order Management</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px] mt-2">Verify transactions and activate memberships</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-80">
                  <input 
                     type="text" 
                     placeholder="Search by name, TrxID..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-bold"
                  />
               </div>
               <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                  {['All', 'Pending', 'Completed', 'Rejected'].map((f) => (
                     <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
                     >
                        {f}
                     </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="glass-card rounded-[48px] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-white/[0.03] text-[10px] font-black text-text-muted uppercase tracking-[3px] border-b border-white/5">
                        <th className="px-10 py-6">Customer</th>
                        <th className="px-10 py-6">Order Details</th>
                        <th className="px-10 py-6">Payment Info</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {filteredOrders.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-10 py-32 text-center">
                              <div className="flex flex-col items-center gap-4">
                                 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                                    <Package className="w-8 h-8 opacity-20" />
                                 </div>
                                 <span className="text-text-muted font-bold text-sm">No orders matching your criteria.</span>
                              </div>
                           </td>
                        </tr>
                     ) : (
                        [...filteredOrders].reverse().map((order: any) => (
                           <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                                       {order.customerName[0]}
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="font-black text-text-primary">{order.customerName}</span>
                                       <span className="text-xs font-bold text-primary">@{order.telegramUsername}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                       <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-black uppercase tracking-widest border border-white/10">{order.plan}</span>
                                    </div>
                                    <span className="text-lg font-black text-text-primary tracking-tighter">{order.amount.toLocaleString()} TK</span>
                                    <span className="text-[10px] text-text-muted font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</span>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">TrxID:</span>
                                       <span className="text-xs font-black text-success uppercase select-all">{order.transactionId}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">From:</span>
                                       <span className="text-xs font-black text-text-primary">{order.paymentNumber}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                    {order.status}
                                 </span>
                              </td>
                              <td className="px-10 py-8">
                                 <div className="flex items-center justify-end gap-3">
                                    {order.status === 'Pending' && (
                                       <>
                                          <button 
                                             onClick={() => {
                                                updateOrder(order.id, { ...order, status: 'Completed' });
                                                toast.success('Order Approved & Member Activated');
                                             }}
                                             className="w-12 h-12 rounded-2xl bg-success/10 text-success hover:bg-success hover:text-white transition-all flex items-center justify-center shadow-lg shadow-success/10"
                                             title="Approve Order"
                                          >
                                             <Check className="w-5 h-5" />
                                          </button>
                                          <button 
                                             onClick={() => {
                                                updateOrder(order.id, { ...order, status: 'Rejected' });
                                                toast.error('Order Rejected');
                                             }}
                                             className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-lg shadow-red-500/10"
                                             title="Reject Order"
                                          >
                                             <X className="w-5 h-5" />
                                          </button>
                                       </>
                                    )}
                                    <button 
                                       onClick={() => {
                                          if (confirm('Delete this order record permanently?')) {
                                             deleteOrder(order.id);
                                             toast.info('Order record deleted');
                                          }
                                       }}
                                       className="w-12 h-12 rounded-2xl bg-white/5 text-text-muted hover:bg-red-500/10 hover:text-red-400 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                                    >
                                       <Trash2 className="w-5 h-5" />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

// ... Rest of components ...

const AnalyticsTab = ({ orders }: any) => {
   const totalSales = orders.reduce((acc: number, order: any) => acc + (order.status === 'Completed' ? order.amount : 0), 0);
   const activeOrders = orders.filter((o: any) => o.status === 'Pending').length;
   const completedOrders = orders.filter((o: any) => o.status === 'Completed').length;
   const conversionRate = orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0;

   const stats = [
      { label: 'Total Sales', value: `${totalSales.toLocaleString()} TK`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
      { label: 'Pending Orders', value: activeOrders.toString(), icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
      { label: 'Total Customers', value: orders.length.toString(), icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
      { label: 'Conversion', value: `${conversionRate}%`, icon: Check, color: 'text-success', bg: 'bg-success/10' },
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
               <h3 className="text-xl font-black">Recent Orders</h3>
               <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">View All</button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-white/[0.02] text-[10px] font-black text-text-muted uppercase tracking-[2px]">
                     <tr>
                        <th className="px-8 py-5">Customer</th>
                        <th className="px-8 py-5">Plan</th>
                        <th className="px-8 py-5">Amount</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Date</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {orders.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-8 py-20 text-center text-text-muted font-bold">No orders yet.</td>
                        </tr>
                     ) : (
                        [...orders].reverse().map((order: any) => (
                           <tr key={order.id} className="hover:bg-white/[0.01] transition-all">
                              <td className="px-8 py-6">
                                 <div className="flex flex-col">
                                    <span className="font-black text-sm">{order.customerName}</span>
                                    <span className="text-[10px] text-text-muted font-bold">{order.telegram}</span>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{order.plan}</span>
                              </td>
                              <td className="px-8 py-6 font-black text-sm">{order.amount} TK</td>
                              <td className="px-8 py-6">
                                 <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                    {order.status}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-text-muted text-xs font-bold">{new Date(order.createdAt).toLocaleDateString()}</td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

const HeroTab = ({ hero, updateHero }: any) => {
   return (
      <div className="space-y-10 max-w-4xl">
         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
            <div className="flex items-center gap-4 pb-6 border-b border-white/5">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><LayoutDashboard className="w-6 h-6" /></div>
               <div>
                  <h3 className="text-xl font-black">Main Hero Content</h3>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Update the main entry section of your site</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Badge (EN)" value={hero.badge} onChange={(v) => updateHero({ ...hero, badge: v })} />
               <Input label="Badge (BN)" value={hero.badgeBn} onChange={(v) => updateHero({ ...hero, badgeBn: v })} />
               <Input label="Main Title (EN)" value={hero.title} onChange={(v) => updateHero({ ...hero, title: v })} />
               <Input label="Main Title (BN)" value={hero.titleBn} onChange={(v) => updateHero({ ...hero, titleBn: v })} />
               <Input label="Title Accent (EN)" value={hero.titleAccent} onChange={(v) => updateHero({ ...hero, titleAccent: v })} />
               <Input label="Title Accent (BN)" value={hero.titleAccentBn} onChange={(v) => updateHero({ ...hero, titleAccentBn: v })} />
               <Input label="Subtitle (EN)" value={hero.subtitle} onChange={(v) => updateHero({ ...hero, subtitle: v })} />
               <Input label="Subtitle (BN)" value={hero.subtitleBn} onChange={(v) => updateHero({ ...hero, subtitleBn: v })} />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">Description (EN)</label>
               <textarea value={hero.description} onChange={(e) => updateHero({ ...hero, description: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">Description (BN)</label>
               <textarea value={hero.descriptionBn} onChange={(e) => updateHero({ ...hero, descriptionBn: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-medium" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Hero Image URL" value={hero.backgroundImage} onChange={(v) => updateHero({ ...hero, backgroundImage: v })} />
               <Input label="Announcement" value={hero.announcement} onChange={(v) => updateHero({ ...hero, announcement: v })} />
            </div>
         </div>
      </div>
   );
};

const PricingTab = ({ pricingFeatures, setPricingFeatures }: any) => {
   const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         const oldIndex = pricingFeatures.findIndex((i: any) => i.id === active.id);
         const newIndex = pricingFeatures.findIndex((i: any) => i.id === over.id);
         setPricingFeatures(arrayMove(pricingFeatures, oldIndex, newIndex).map((f: any, i: number) => ({ ...f, order: i + 1 })));
      }
   };

   const addFeature = () => {
      setPricingFeatures([{
         id: Date.now().toString(),
         title: 'New Feature',
         titleBn: 'নতুন ফিচার',
         visible: true,
         order: 0,
         plans: { monthly: true, yearly: true, lifetime: true }
      }, ...pricingFeatures].map((f, i) => ({ ...f, order: i + 1 })));
      toast.success('Feature added to top');
   };

   const removeFeature = (id: string) => {
      setPricingFeatures(pricingFeatures.filter((f: any) => f.id !== id));
   };

   const updateFeature = (id: string, updates: any) => {
      setPricingFeatures(pricingFeatures.map((f: any) => f.id === id ? { ...f, ...updates } : f));
   };

   const togglePlan = (id: string, plan: 'monthly' | 'yearly' | 'lifetime') => {
      const feature = pricingFeatures.find((f: any) => f.id === id);
      if (feature) {
         updateFeature(id, {
            plans: { ...feature.plans, [plan]: !feature.plans[plan] }
         });
      }
   };

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <div>
               <h3 className="text-2xl font-black">Plan Comparison Manager</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Control feature availability per tier</p>
            </div>
            <button onClick={addFeature} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
               <Plus className="w-5 h-5" /> Add New Row
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pricingFeatures.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
               <div className="space-y-4">
                  {pricingFeatures.map((f: any) => (
                     <SortableItem key={f.id} id={f.id}>
                        <div className="glass-card p-8 rounded-[32px] border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative group bg-white/[0.01]">
                           <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                              <Input label="Feature Title (EN)" value={f.title} onChange={(v: string) => updateFeature(f.id, { title: v })} />
                              <Input label="Feature Title (BN)" value={f.titleBn} onChange={(v: string) => updateFeature(f.id, { titleBn: v })} />
                           </div>

                           <div className="lg:col-span-5">
                              <label className="text-[10px] font-black text-text-muted uppercase mb-4 tracking-widest px-1 block text-center lg:text-left">Plan Availability</label>
                              <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                 {['monthly', 'yearly', 'lifetime'].map((plan) => (
                                    <button
                                       key={plan}
                                       onClick={() => togglePlan(f.id, plan as any)}
                                       className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${f.plans[plan]
                                             ? 'bg-success/10 text-success border-success/30 shadow-lg shadow-success/10'
                                             : 'bg-white/5 text-text-muted border-white/10 opacity-40'
                                          }`}
                                    >
                                       {plan}
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div className="lg:col-span-3 flex items-center justify-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                              <button onClick={() => updateFeature(f.id, { visible: !f.visible })} className={`p-4 rounded-2xl transition-all ${f.visible ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                                 {f.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                              </button>
                              <button onClick={() => removeFeature(f.id)} className="p-4 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500/20 border border-red-500/10 transition-all">
                                 <Trash2 className="w-5 h-5" />
                              </button>
                           </div>
                        </div>
                     </SortableItem>
                  ))}
               </div>
            </SortableContext>
         </DndContext>
      </div>
   );
};

const ProductsTab = ({ products, setProducts }: any) => {
   const addProduct = () => {
      setProducts([{
         id: Date.now().toString(),
         title: 'New VIP Plan',
         titleBn: 'নতুন ভিআইপি প্ল্যান',
         subtitle: 'Access to exclusive content',
         subtitleBn: 'এক্সক্লুসিভ কন্টেন্ট এক্সেস',
         badge: 'New',
         badgeBn: 'নতুন',
         shortDescription: '',
         shortDescriptionBn: '',
         buttonText: 'Join Now',
         buttonTextBn: 'এখনই যোগ দিন',
         telegramLink: '',
         image: '',
         visible: true,
         order: 0,
         plans: [
            { id: 'p1', name: 'Monthly', nameBn: 'মান্থলি', priceTk: 500, priceUsd: 5, duration: 'Monthly' },
            { id: 'p2', name: 'Yearly', nameBn: 'ইয়ারলি', priceTk: 3000, priceUsd: 30, duration: 'Yearly' },
            { id: 'p3', name: 'Lifetime', nameBn: 'লাইফটাইম', priceTk: 5000, priceUsd: 50, duration: 'Lifetime' }
         ],
         bulletPoints: [],
         features: []
      }, ...products].map((p, i) => ({ ...p, order: i + 1 })));
      toast.success('Product added');
   };

   const updateProduct = (id: string, updates: any) => {
      setProducts(products.map((p: any) => p.id === id ? { ...p, ...updates } : p));
   };

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <div>
               <h3 className="text-2xl font-black">Product Management</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Create and manage your subscription tiers</p>
            </div>
            <button onClick={addProduct} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
               <Plus className="w-5 h-5" /> Add New Product
            </button>
         </div>

         <div className="grid grid-cols-1 gap-8">
            {products.map((p: any) => (
               <div key={p.id} className="glass-card p-10 rounded-[48px] border-white/5 space-y-10 bg-white/[0.01]">
                  <div className="flex justify-between items-start border-b border-white/5 pb-8">
                     <div className="flex gap-8 items-center">
                        <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                           {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-text-muted"><Package className="w-8 h-8" /></div>}
                        </div>
                        <div>
                           <h4 className="text-2xl font-black tracking-tighter">{p.title}</h4>
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest">{p.badge}</span>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={() => updateProduct(p.id, { visible: !p.visible })} className={`p-4 rounded-2xl transition-all ${p.visible ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'}`}>
                           {p.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setProducts(products.filter((prod: any) => prod.id !== p.id))} className="p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/10"><Trash2 className="w-5 h-5" /></button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <Input label="Title (EN)" value={p.title} onChange={(v: string) => updateProduct(p.id, { title: v })} />
                     <Input label="Title (BN)" value={p.titleBn} onChange={(v: string) => updateProduct(p.id, { titleBn: v })} />
                     <Input label="Subtitle (EN)" value={p.subtitle} onChange={(v: string) => updateProduct(p.id, { subtitle: v })} />
                     <Input label="Subtitle (BN)" value={p.subtitleBn} onChange={(v: string) => updateProduct(p.id, { subtitleBn: v })} />
                     <Input label="Badge (EN)" value={p.badge} onChange={(v: string) => updateProduct(p.id, { badge: v })} />
                     <Input label="Badge (BN)" value={p.badgeBn} onChange={(v: string) => updateProduct(p.id, { badgeBn: v })} />
                     <Input label="Image URL" value={p.image} onChange={(v: string) => updateProduct(p.id, { image: v })} />
                     <Input label="Button Text" value={p.buttonText} onChange={(v: string) => updateProduct(p.id, { buttonText: v })} />
                     <Input label="Support Link" value={p.telegramLink} onChange={(v: string) => updateProduct(p.id, { telegramLink: v })} />
                  </div>

                  <div className="space-y-6 pt-6 border-t border-white/5">
                     <h5 className="text-xs font-black uppercase tracking-widest text-text-muted px-1">Pricing Tiers</h5>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {p.plans.map((plan: any, idx: number) => (
                           <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{plan.duration}</span>
                              <div className="space-y-3">
                                 <Input label="Price (TK)" value={plan.priceTk} onChange={(v) => {
                                    const newPlans = [...p.plans];
                                    newPlans[idx].priceTk = Number(v);
                                    updateProduct(p.id, { plans: newPlans });
                                 }} />
                                 <Input label="Name (EN)" value={plan.name} onChange={(v) => {
                                    const newPlans = [...p.plans];
                                    newPlans[idx].name = v;
                                    updateProduct(p.id, { plans: newPlans });
                                 }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

const ReviewsTab = ({ reviews, setReviews }: any) => {
   const addReview = () => {
      setReviews([{
         id: Date.now().toString(),
         name: 'Customer Name',
         role: 'VIP Member',
         roleBn: 'ভিআইপি মেম্বার',
         image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random(),
         rating: 5,
         review: 'Great service!',
         reviewBn: 'অসাধারণ সার্ভিস!',
         featured: true,
         visible: true,
         order: 0
      }, ...reviews].map((r, i) => ({ ...r, order: i + 1 })));
      toast.success('Review added');
   };

   const updateReview = (id: string, updates: any) => {
      setReviews(reviews.map((r: any) => r.id === id ? { ...r, ...updates } : r));
   };

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <div>
               <h3 className="text-2xl font-black">Member Testimonials</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Showcase social proof to build trust</p>
            </div>
            <button onClick={addReview} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
               <Plus className="w-5 h-5" /> Add New Review
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((r: any) => (
               <div key={r.id} className="glass-card p-10 rounded-[48px] border-white/5 space-y-8 relative group">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <img src={r.image} className="w-16 h-16 rounded-2xl border border-white/10" />
                        <div>
                           <h4 className="font-black text-lg tracking-tighter">{r.name}</h4>
                           <span className="text-[10px] font-bold text-text-muted">{r.role}</span>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => updateReview(r.id, { visible: !r.visible })} className={`p-3 rounded-xl ${r.visible ? 'text-primary bg-primary/10' : 'text-text-muted bg-white/5'}`}><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setReviews(reviews.filter((rev: any) => rev.id !== r.id))} className="p-3 bg-red-500/10 text-red-400 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <Input label="Name" value={r.name} onChange={(v) => updateReview(r.id, { name: v })} />
                     <Input label="Review (EN)" value={r.review} onChange={(v) => updateReview(r.id, { review: v })} />
                     <Input label="Review (BN)" value={r.reviewBn} onChange={(v) => updateReview(r.id, { reviewBn: v })} />
                     <div className="flex gap-4">
                        <div className="flex-1"><Input label="Rating (1-5)" value={r.rating} onChange={(v) => updateReview(r.id, { rating: Number(v) })} /></div>
                        <div className="flex-1"><Input label="Role (EN)" value={r.role} onChange={(v) => updateReview(r.id, { role: v })} /></div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

const FAQTab = ({ faqs, setFAQs }: any) => {
   const addFAQ = () => {
      setFAQs([{
         id: Date.now().toString(),
         q: 'New Question',
         qBn: 'নতুন প্রশ্ন',
         a: 'Answer content...',
         aBn: 'উত্তরের বিস্তারিত...',
         visible: true,
         order: 0
      }, ...faqs].map((f, i) => ({ ...f, order: i + 1 })));
      toast.success('FAQ added');
   };

   const updateFAQ = (id: string, updates: any) => {
      setFAQs(faqs.map((f: any) => f.id === id ? { ...f, ...updates } : f));
   };

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <div>
               <h3 className="text-2xl font-black">Help Center (FAQ)</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Answer common customer questions</p>
            </div>
            <button onClick={addFAQ} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
               <Plus className="w-5 h-5" /> Add FAQ
            </button>
         </div>

         <div className="space-y-6">
            {faqs.map((f: any) => (
               <div key={f.id} className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
                  <div className="flex justify-between items-center">
                     <h4 className="text-lg font-black tracking-tight">{f.q || 'Untitled Question'}</h4>
                     <div className="flex gap-3">
                        <button onClick={() => updateFAQ(f.id, { visible: !f.visible })} className={`p-3 rounded-xl ${f.visible ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'}`}><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setFAQs(faqs.filter((faq: any) => faq.id !== f.id))} className="p-3 bg-red-500/10 text-red-400 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <Input label="Question (EN)" value={f.q} onChange={(v) => updateFAQ(f.id, { q: v })} />
                        <textarea value={f.a} onChange={(e) => updateFAQ(f.id, { a: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm" placeholder="Answer (EN)" />
                     </div>
                     <div className="space-y-6">
                        <Input label="Question (BN)" value={f.qBn} onChange={(v) => updateFAQ(f.id, { qBn: v })} />
                        <textarea value={f.aBn} onChange={(e) => updateFAQ(f.id, { aBn: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-sm" placeholder="Answer (BN)" />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

const PaymentTab = ({ paymentMethods, setPaymentMethods }: any) => {
   const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         const oldIndex = paymentMethods.findIndex((i: any) => i.id === active.id);
         const newIndex = paymentMethods.findIndex((i: any) => i.id === over.id);
         setPaymentMethods(arrayMove(paymentMethods, oldIndex, newIndex).map((m: any, i: number) => ({ ...m, order: i + 1 })));
      }
   };

   const addMethod = () => {
      setPaymentMethods([{
         id: Date.now().toString(),
         name: 'New Method',
         type: 'Personal',
         number: '',
         accountName: '',
         qrCode: '',
         instructions: '',
         enabled: true,
         icon: 'wallet',
         color: '#7C3AED',
         order: 0
      }, ...paymentMethods].map((m, i) => ({ ...m, order: i + 1 })));
      toast.success('Method added to top');
   };

   const updateMethod = (id: string, updates: any) => {
      setPaymentMethods(paymentMethods.map((m: any) => m.id === id ? { ...m, ...updates } : m));
   };

   const deleteMethod = (id: string) => {
      setPaymentMethods(paymentMethods.filter((m: any) => m.id !== id));
   };

   return (
      <div className="space-y-10">
         <div className="flex justify-between items-center bg-white/5 p-8 rounded-[32px] border border-white/10">
            <div>
               <h3 className="text-2xl font-black">Payment Channels</h3>
               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Configure multi-payment gateways for checkout</p>
            </div>
            <button onClick={addMethod} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
               <Plus className="w-5 h-5" /> Add New Channel
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={paymentMethods.map((m: any) => m.id)} strategy={verticalListSortingStrategy}>
               <div className="space-y-8">
                  {paymentMethods.map((m: any) => (
                     <SortableItem key={m.id} id={m.id}>
                        <div className="glass-card p-10 rounded-[48px] border-white/5 space-y-10 relative group bg-white/[0.01]">
                           <div className="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-white/5 gap-8">
                              <div className="flex items-center gap-6">
                                 <div
                                    className="w-16 h-16 rounded-[22px] flex items-center justify-center text-white font-black text-2xl shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundColor: m.color }}
                                 >
                                    {m.name[0]}
                                 </div>
                                 <div>
                                    <h4 className="font-black text-2xl tracking-tighter">{m.name}</h4>
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[3px]">{m.type} Account</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <button onClick={() => updateMethod(m.id, { enabled: !m.enabled })} className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all border ${m.enabled ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                                    {m.enabled ? 'ACTIVE' : 'INACTIVE'}
                                 </button>
                                 <button onClick={() => deleteMethod(m.id)} className="p-4 bg-red-500/10 text-red-400 rounded-2xl hover:bg-red-500/20 border border-red-500/10 transition-all">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              <Input label="Display Name" value={m.name} onChange={(v: string) => updateMethod(m.id, { name: v })} />
                              <Input label="Account Type" value={m.type} onChange={(v: string) => updateMethod(m.id, { type: v })} />
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">Brand Color (Hex)</label>
                                 <div className="flex gap-3">
                                    <div className="w-14 h-14 rounded-2xl border border-white/10 shadow-inner" style={{ backgroundColor: m.color }} />
                                    <input value={m.color} onChange={(e) => updateMethod(m.id, { color: e.target.value })} className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-black uppercase" />
                                 </div>
                              </div>
                              <Input label="Account Number / ID" value={m.number} onChange={(v: string) => updateMethod(m.id, { number: v })} />
                              <Input label="Account Holder Name" value={m.accountName} onChange={(v: string) => updateMethod(m.id, { accountName: v })} />
                              <Input label="QR Code Image URL" value={m.qrCode} onChange={(v: string) => updateMethod(m.id, { qrCode: v })} />
                           </div>

                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-2 block px-1">Payment Instructions (Step-by-Step)</label>
                              <textarea
                                 value={m.instructions}
                                 onChange={(e) => updateMethod(m.id, { instructions: e.target.value })}
                                 className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-6 text-sm h-40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-medium leading-relaxed"
                                 placeholder="Enter detailed steps for the customer..."
                              />
                           </div>
                        </div>
                     </SortableItem>
                  ))}
               </div>
            </SortableContext>
         </DndContext>
      </div>
   );
};

// Settings Tab (Merged TrustBadges, Pixels, General)
const SettingsTab = ({ settings, updateSettings, pixelSettings, updatePixelSettings, trustBadges, setTrustBadges }: any) => {
   return (
      <div className="space-y-10 max-w-6xl">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Globe className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black">Site Identity</h3>
               </div>
               <div className="space-y-6">
                  <Input label="Site Name (EN)" value={settings.siteName} onChange={(v) => updateSettings({ ...settings, siteName: v })} />
                  <Input label="Site Name (BN)" value={settings.siteNameBn} onChange={(v) => updateSettings({ ...settings, siteNameBn: v })} />
                  <Input label="Logo Text" value={settings.logo} onChange={(v) => updateSettings({ ...settings, logo: v })} />
                  <Input label="Admin Password" value={settings.adminPassword || 'pro_access_23'} type="password" onChange={(v) => updateSettings({ ...settings, adminPassword: v })} />
               </div>
            </div>

            <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success"><Smartphone className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black">Telegram Integration</h3>
               </div>
               <div className="space-y-6">
                  <Input label="Admin Handle" value={settings.telegramHandle} onChange={(v) => updateSettings({ ...settings, telegramHandle: v })} />
                  <Input label="Support Link" value={settings.telegramLink} onChange={(v) => updateSettings({ ...settings, telegramLink: v })} />
                  <Input label="Floating CTA Text" value={settings.floatingCTA} onChange={(v) => updateSettings({ ...settings, floatingCTA: v })} />
               </div>
            </div>
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary"><ShieldCheck className="w-6 h-6" /></div>
                  <h3 className="text-xl font-black">Trust Indicators</h3>
               </div>
               <button onClick={() => setTrustBadges([{ id: Date.now().toString(), text: 'New Badge', textBn: 'নতুন ব্যাজ', icon: 'Shield', visible: true, order: 0 }, ...trustBadges])} className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Badge
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {trustBadges.map((badge: any, idx: number) => (
                  <div key={badge.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6 relative group">
                     <button onClick={() => setTrustBadges(trustBadges.filter((b: any) => b.id !== badge.id))} className="absolute top-6 right-6 text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-400/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                     <Input label="Label (EN)" value={badge.text} onChange={(v) => setTrustBadges(trustBadges.map((b: any) => b.id === badge.id ? { ...b, text: v } : b))} />
                     <Input label="Label (BN)" value={badge.textBn} onChange={(v) => setTrustBadges(trustBadges.map((b: any) => b.id === badge.id ? { ...b, textBn: v } : b))} />
                     <Input label="Icon (Lucide)" value={badge.icon} onChange={(v) => setTrustBadges(trustBadges.map((b: any) => b.id === badge.id ? { ...b, icon: v } : b))} />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

// --- Main Dashboard ---

export const AdminDashboard = ({ defaultTab = 'analytics' }: { defaultTab?: string }) => {
   const {
      isAdmin, setAdminStatus, hero, updateHero, orders, updateOrder, deleteOrder,
      products, setProducts, reviews, setReviews, faqs, setFAQs,
      pricingFeatures, setPricingFeatures, paymentMethods, setPaymentMethods,
      settings, updateSettings, pixelSettings, updatePixelSettings,
      trustBadges, setTrustBadges
   } = useStore();
   const [activeTab, setActiveTab] = useState(defaultTab);
   const [password, setPassword] = useState('');
   const [isHydrated, setIsHydrated] = useState(false);

   useEffect(() => {
      setIsHydrated(true);
      setActiveTab(defaultTab);
   }, [defaultTab]);

   if (!isHydrated) return null;

   if (!isAdmin) {
      return (
         <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 mesh-gradient">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card rounded-[48px] p-12 lg:p-16 text-center border-white/10 shadow-2xl">
               <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mx-auto mb-10 border border-primary/20 rotate-3">
                  <ShieldCheck className="w-10 h-10 text-primary" />
               </div>
               <h2 className="text-3xl font-black mb-4 tracking-tighter">Identity Verified</h2>
               <p className="text-text-muted font-bold text-sm mb-10 leading-relaxed uppercase tracking-widest">Administrative Access Only</p>
               <div className="space-y-4">
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="Enter Console Key"
                     className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-center font-black tracking-[10px] text-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all placeholder:tracking-normal placeholder:font-bold placeholder:text-sm"
                  />
                  <button
                     onClick={() => password === (settings.adminPassword || 'pro_access_23') ? setAdminStatus(true) : toast.error('Access Denied')}
                     className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-[3px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                     Unlock Console
                  </button>
               </div>
            </motion.div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#020617] flex">
         <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setAdminStatus(false)} />

         <main className="flex-1 p-10 lg:p-16 bg-[#020617] relative overflow-y-auto">
            {/* Top Header */}
            <header className="flex items-center justify-between mb-16">
               <div>
                  <h2 className="text-4xl font-black tracking-tighter capitalize">{activeTab}</h2>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[3px] mt-2">Manage your VIP ecosystem</p>
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                     <span className="text-xs font-black text-text-primary">Administrator</span>
                     <span className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Online
                     </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 p-1">
                     <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Admin" className="w-full h-full rounded-xl" alt="Admin" />
                  </div>
               </div>
            </header>

            {/* Tab Content */}
            <div className="pb-20">
               {activeTab === 'analytics' && <AnalyticsTab orders={orders} />}
               {activeTab === 'orders' && <OrdersTab orders={orders} updateOrder={updateOrder} deleteOrder={deleteOrder} />}
               {activeTab === 'hero' && <HeroTab hero={hero} updateHero={updateHero} />}
               {activeTab === 'products' && <ProductsTab products={products} setProducts={setProducts} />}
               {activeTab === 'pricing' && <PricingTab pricingFeatures={pricingFeatures} setPricingFeatures={setPricingFeatures} />}
               {activeTab === 'payments' && <PaymentTab paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods} />}
               {activeTab === 'reviews' && <ReviewsTab reviews={reviews} setReviews={setReviews} />}
               {activeTab === 'faq' && <FAQTab faqs={faqs} setFAQs={setFAQs} />}
               {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} pixelSettings={pixelSettings} updatePixelSettings={updatePixelSettings} trustBadges={trustBadges} setTrustBadges={setTrustBadges} />}
            </div>
         </main>
      </div>
   );
};

// --- Input Component ---
const Input = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
   <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] ml-1">{label}</label>
      <input
         type={type}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className="h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 transition-all font-bold placeholder:text-text-muted/30"
      />
   </div>
);
