import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, Product, FAQ, Review, BulletPoint, Feature, ProductPlan } from '../store/useStore';
import {
   LayoutDashboard,
   Package,
   ShoppingCart,
   Settings,
   HelpCircle,
   Star,
   Type,
   Bell,
   LogOut,
   ChevronRight,
   Save,
   Plus,
   Trash2,
   Check,
   X,
   Languages,
   DollarSign,
   Send,
   Globe,
   GripVertical,
   Image as ImageIcon,
   Link as LinkIcon,
   ShieldCheck,
   Zap,
   Clock,
   Eye,
   EyeOff,
   ChevronDown,
   ChevronUp,
   Layout
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// DnD Kit Imports
import {
   DndContext,
   closestCenter,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   DragEndEvent,
} from '@dnd-kit/core';
import {
   arrayMove,
   SortableContext,
   sortableKeyboardCoordinates,
   verticalListSortingStrategy,
   useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Reusable Sortable Item Component ---
interface SortableItemProps {
   id: string;
   children: React.ReactNode;
   handleClassName?: string;
   key?: any;
}

const SortableItem = ({ id, children, handleClassName }: SortableItemProps) => {
   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
   } = useSortable({ id });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 'auto',
      opacity: isDragging ? 0.5 : 1,
   };

   return (
      <div ref={setNodeRef} style={style} className="relative group">
         <div {...attributes} {...listeners} className={`absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-2 text-text-muted hover:text-primary transition-colors z-10 ${handleClassName}`}>
            <GripVertical className="w-4 h-4" />
         </div>
         {children}
      </div>
   );
};

export const AdminDashboard = () => {
   const [activeTab, setActiveTab] = useState('overview');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const navigate = useNavigate();
   const {
      setAdminStatus,
      language,
      products,
      setProducts,
      hero,
      updateHero,
      faqs,
      setFAQs,
      reviews,
      setReviews,
      settings,
      updateSettings,
      paymentSettings,
      updatePaymentSettings,
      pixelSettings,
      updatePixelSettings,
      countdown,
      updateCountdown,
      footer,
      updateFooter,
      navbar,
      updateNavbar,
      trustBadges,
      setTrustBadges,
      globalFeatures,
      setGlobalFeatures,
      pricingFeatures,
      setPricingFeatures,
      paymentMethods,
      setPaymentMethods
   } = useStore();

   const handleLogout = () => {
      setAdminStatus(false);
      navigate('/');
      toast.info('Logged out from Admin Dashboard');
   };

   const tabs = [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'hero', label: 'Hero', icon: Type },
      { id: 'navbar', label: 'Navbar', icon: Layout },
      { id: 'features', label: 'Features', icon: Zap },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'faq', label: 'FAQ', icon: HelpCircle },
      { id: 'countdown', label: 'Countdown', icon: Clock },
      { id: 'pricing', label: 'Pricing', icon: DollarSign },
      { id: 'payment', label: 'Payment', icon: DollarSign },
      { id: 'footer', label: 'Footer', icon: ShieldCheck },
      { id: 'settings', label: 'Settings', icon: Settings },
   ];

   return (
      <div className="min-h-screen bg-[#020617] text-text-primary font-sans selection:bg-primary/30">
         {/* Mobile Header */}
         <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F172A] border-b border-white/5 z-[60] flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black">A</div>
               <span className="font-bold">Admin CMS</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-text-primary">
               {isSidebarOpen ? <X /> : <MenuIcon />}
            </button>
         </div>

         <div className="flex pt-16 lg:pt-6">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0F172A] border-r border-white/5 z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
               <div className="flex flex-col h-full">
                  <div className="p-10 hidden lg:flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">A</div>
                     <div>
                        <h1 className="font-black text-lg leading-none">Command</h1>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1">Center CMS</p>
                     </div>
                  </div>

                  <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-6 scrollbar-hide">
                     {tabs.map(tab => (
                        <button
                           key={tab.id}
                           onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                           className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                              ? 'bg-primary text-white shadow-lg shadow-primary/20'
                              : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                              }`}
                        >
                           <tab.icon className="w-5 h-5" />
                           {tab.label}
                        </button>
                     ))}
                  </nav>

                  <div className="p-4 border-t border-white/5">
                     <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
                     >
                        <LogOut className="w-5 h-5" />
                        Logout System
                     </button>
                  </div>
               </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 min-h-screen p-8 lg:pt-20 lg:pl-20 lg:pr-12 lg:pb-24">
               <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                     <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[3px] mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Admin Dashboard
                     </div>
                     <h1 className="text-4xl font-black text-text-primary tracking-tight">
                        {tabs.find(t => t.id === activeTab)?.label}
                     </h1>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                     <div className="px-4 py-2 text-xs font-black text-text-muted border-r border-white/10 uppercase">Autosave Active</div>
                     <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success">
                        <Check className="w-5 h-5" />
                     </div>
                  </div>
               </header>

               <AnimatePresence mode="wait">
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                     className="pb-20"
                  >
                     {activeTab === 'overview' && <OverviewTab products={products} />}
                     {activeTab === 'hero' && <HeroTab hero={hero} updateHero={updateHero} />}
                     {activeTab === 'navbar' && <NavbarTab navbar={navbar} updateNavbar={updateNavbar} />}
                     {activeTab === 'features' && <FeaturesTab globalFeatures={globalFeatures} setGlobalFeatures={setGlobalFeatures} />}
                     {activeTab === 'products' && <ProductsTab products={products} setProducts={setProducts} />}
                     {activeTab === 'reviews' && <ReviewsTab reviews={reviews} setReviews={setReviews} />}
                     {activeTab === 'faq' && <FAQTab faqs={faqs} setFAQs={setFAQs} />}
                     {activeTab === 'countdown' && <CountdownTab countdown={countdown} updateCountdown={updateCountdown} />}
                     {activeTab === 'payment' && <PaymentTab paymentSettings={paymentSettings} updatePaymentSettings={updatePaymentSettings} paymentMethods={paymentMethods} setPaymentMethods={setPaymentMethods} />}
                     {activeTab === 'pricing' && <PricingTab pricingFeatures={pricingFeatures} setPricingFeatures={setPricingFeatures} />}
                     {activeTab === 'footer' && <FooterTab footer={footer} updateFooter={updateFooter} />}
                     {activeTab === 'settings' && (
                        <SettingsTab
                           settings={settings}
                           updateSettings={updateSettings}
                           pixelSettings={pixelSettings}
                           updatePixelSettings={updatePixelSettings}
                           trustBadges={trustBadges}
                           setTrustBadges={setTrustBadges}
                        />
                     )}
                  </motion.div>
               </AnimatePresence>
            </main>
         </div>

         {/* Admin Quick Float */}
         <Link to="/" className="fixed bottom-8 right-8 w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-text-primary hover:bg-white/10 transition-all shadow-2xl z-[100] group">
            <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
         </Link>
      </div>
   );
};

// --- Tab Components ---

const OverviewTab = ({ products }: { products: Product[] }) => {
   const stats = [
      { label: 'Platform Status', value: 'Operational', color: 'text-success', icon: Zap },
      { label: 'Active Products', value: products.filter(p => p.visible).length, color: 'text-primary', icon: Package },
      { label: 'Total Products', value: products.length, color: 'text-secondary', icon: Layout },
      { label: 'Last Updated', value: 'Just Now', color: 'text-warning', icon: Clock },
   ];

   return (
      <div className="space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
               <div key={i} className="glass-card p-8 rounded-3xl group hover:border-primary/30 transition-all duration-500">
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-text-primary">{stat.value}</p>
               </div>
            ))}
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5 relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="text-2xl font-black mb-2">Welcome to your CMS</h3>
               <p className="text-text-secondary max-w-lg mb-8">Everything you see here is instantly reflected on your live landing page. No manual deployments needed.</p>
               <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-success" />
                     <span className="text-sm font-bold">LocalStorage Sync Enabled</span>
                  </div>
                  <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-primary" />
                     <span className="text-sm font-bold">Autosave Active</span>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 to-transparent -z-0" />
         </div>
      </div>
   );
};

const HeroTab = ({ hero, updateHero }: any) => {
   const [activeLang, setActiveLang] = useState<'en' | 'bn'>('en');

   const handleChange = (field: string, value: any) => {
      updateHero({ ...hero, [field]: value });
   };

   return (
      <div className="space-y-8">
         <div className="glass-card p-10 rounded-[40px] border-white/5">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black">Hero Content</h3>
               <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button onClick={() => setActiveLang('en')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeLang === 'en' ? 'bg-white text-black shadow-lg' : 'text-text-muted hover:text-text-primary'}`}>ENGLISH</button>
                  <button onClick={() => setActiveLang('bn')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeLang === 'bn' ? 'bg-white text-black shadow-lg' : 'text-text-muted hover:text-text-primary'}`}>বাংলা</button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label={activeLang === 'en' ? "Badge Text" : "ব্যাজ টেক্সট"} value={activeLang === 'en' ? hero.badge : hero.badgeBn} onChange={(v) => handleChange(activeLang === 'en' ? 'badge' : 'badgeBn', v)} />
               <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Input label={activeLang === 'en' ? "Title Main" : "টাইটেল (প্রধান)"} value={activeLang === 'en' ? hero.title : hero.titleBn} onChange={(v) => handleChange(activeLang === 'en' ? 'title' : 'titleBn', v)} />
                  <Input label={activeLang === 'en' ? "Title Accent" : "টাইটেল (অ্যাকসেন্ট)"} value={activeLang === 'en' ? hero.titleAccent : hero.titleAccentBn} onChange={(v) => handleChange(activeLang === 'en' ? 'titleAccent' : 'titleAccentBn', v)} />
                  <Input label={activeLang === 'en' ? "Subtitle" : "সাবটাইটেল"} value={activeLang === 'en' ? hero.subtitle : hero.subtitleBn} onChange={(v) => handleChange(activeLang === 'en' ? 'subtitle' : 'subtitleBn', v)} />
               </div>
               <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Description</label>
                  <textarea
                     value={activeLang === 'en' ? hero.description : hero.descriptionBn}
                     onChange={(e) => handleChange(activeLang === 'en' ? 'description' : 'descriptionBn', e.target.value)}
                     className="w-full bg-white/5 border border-white/10 rounded-[24px] px-6 py-5 text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all h-32"
                  />
               </div>
               <Input label="CTA Button 1" value={activeLang === 'en' ? hero.cta1 : hero.cta1Bn} onChange={(v) => handleChange(activeLang === 'en' ? 'cta1' : 'cta1Bn', v)} />
               <Input label="CTA Button 2" value={activeLang === 'en' ? hero.cta2 : hero.cta2Bn} onChange={(v) => handleChange(activeLang === 'en' ? 'cta2' : 'cta2Bn', v)} />
               <div className="md:col-span-2">
                  <Input label="Background Image URL" value={hero.backgroundImage} onChange={(v) => handleChange('backgroundImage', v)} />
               </div>
            </div>
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5">
            <h3 className="text-xl font-black mb-8">Hero Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {hero.stats.map((stat: any, i: number) => (
                  <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Stat #{i + 1}</span>
                     </div>
                     <Input label="Value (EN)" value={stat.value} onChange={(v) => {
                        const newStats = [...hero.stats];
                        newStats[i].value = v;
                        handleChange('stats', newStats);
                     }} />
                     <Input label="Value (BN)" value={stat.valueBn} onChange={(v) => {
                        const newStats = [...hero.stats];
                        newStats[i].valueBn = v;
                        handleChange('stats', newStats);
                     }} />
                     <Input label="Label (EN)" value={stat.label} onChange={(v) => {
                        const newStats = [...hero.stats];
                        newStats[i].label = v;
                        handleChange('stats', newStats);
                     }} />
                     <Input label="Label (BN)" value={stat.labelBn} onChange={(v) => {
                        const newStats = [...hero.stats];
                        newStats[i].labelBn = v;
                        handleChange('stats', newStats);
                     }} />
                  </div>
               ))}
            </div>
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black">Announcement Banner</h3>
               <button onClick={() => handleChange('showAnnouncement', !hero.showAnnouncement)} className={`px-6 py-3 rounded-2xl font-black text-xs transition-all ${hero.showAnnouncement ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>
                  {hero.showAnnouncement ? 'VISIBLE' : 'HIDDEN'}
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Announcement (EN)" value={hero.announcement} onChange={(v) => handleChange('announcement', v)} />
               <Input label="Announcement (BN)" value={hero.announcementBn} onChange={(v) => handleChange('announcementBn', v)} />
            </div>
         </div>
      </div>
   );
};

const NavbarTab = ({ navbar, updateNavbar }: any) => {
   const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
   );

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         const oldIndex = navbar.items.findIndex((i: any) => i.url === active.id);
         const newIndex = navbar.items.findIndex((i: any) => i.url === over.id);
         const newItems = arrayMove(navbar.items, oldIndex, newIndex).map((item: any, index: number) => Object.assign({}, item, { order: index + 1 }));
         updateNavbar({ ...navbar, items: newItems });
      }
   };

   const addItem = () => {
      const newItem = { label: 'New Link', labelBn: 'নতুন লিঙ্ক', url: '#', order: navbar.items.length + 1 };
      updateNavbar({ ...navbar, items: [...navbar.items, newItem] });
   };

   const removeItem = (url: string) => {
      const newItems = navbar.items.filter((i: any) => i.url !== url).map((item: any, index: number) => ({ ...item, order: index + 1 }));
      updateNavbar({ ...navbar, items: newItems });
   };

   const updateItem = (url: string, field: string, value: string) => {
      const newItems = navbar.items.map((i: any) => i.url === url ? { ...i, [field]: value } : i);
      updateNavbar({ ...navbar, items: newItems });
   };

   return (
      <div className="glass-card p-10 rounded-[40px] border-white/5">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black">Navbar Menu</h3>
            <button onClick={addItem} className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/20">
               <Plus className="w-5 h-5" /> Add Menu Item
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={navbar.items.map((i: any) => i.url)} strategy={verticalListSortingStrategy}>
               <div className="space-y-4">
                  {navbar.items.map((item: any) => (
                     <SortableItem key={item.url} id={item.url}>
                        <div className="pl-14 pr-6 py-6 bg-white/5 border border-white/10 rounded-[28px] grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                           <Input label="Label (EN)" value={item.label} onChange={(v) => updateItem(item.url, 'label', v)} />
                           <Input label="Label (BN)" value={item.labelBn} onChange={(v) => updateItem(item.url, 'labelBn', v)} />
                           <div className="flex items-end gap-4">
                              <div className="flex-1">
                                 <Input label="URL / ID" value={item.url} onChange={(v) => updateItem(item.url, 'url', v)} />
                              </div>
                              <button onClick={() => removeItem(item.url)} className="p-3.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
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

const FeaturesTab = ({ globalFeatures, setGlobalFeatures }: any) => {
   const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         const oldIndex = globalFeatures.findIndex((i: any) => i.id === active.id);
         const newIndex = globalFeatures.findIndex((i: any) => i.id === over.id);
         setGlobalFeatures(arrayMove(globalFeatures, oldIndex, newIndex).map((f: any, i: number) => ({ ...f, order: i + 1 })));
      }
   };

   const addFeature = () => {
      setGlobalFeatures([...globalFeatures, { id: Date.now().toString(), title: 'New Feature', titleBn: 'নতুন ফিচার', description: 'Description', descriptionBn: 'বিবরণ', icon: 'Zap', visible: true, order: globalFeatures.length + 1 }]);
   };

   const updateFeature = (id: string, updates: any) => {
      setGlobalFeatures(globalFeatures.map((f: any) => f.id === id ? { ...f, ...updates } : f));
   };

   const deleteFeature = (id: string) => {
      setGlobalFeatures(globalFeatures.filter((f: any) => f.id !== id));
   };

   return (
      <div className="space-y-8">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">Global Features</h3>
            <button onClick={addFeature} className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
               <Plus className="w-5 h-5" /> Add Feature
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={globalFeatures.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {globalFeatures.map((f: any) => (
                     <SortableItem key={f.id} id={f.id}>
                        <div className="glass-card p-8 rounded-[32px] border-white/5 space-y-6">
                           <div className="flex justify-between items-center">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                 <Zap className="w-5 h-5" />
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => updateFeature(f.id, { visible: !f.visible })} className={`p-2 rounded-xl ${f.visible ? 'text-primary' : 'text-text-muted'}`}>
                                    {f.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                 </button>
                                 <button onClick={() => deleteFeature(f.id)} className="p-2 text-red-400"><Trash2 className="w-5 h-5" /></button>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 gap-6">
                              <Input label="Title (EN)" value={f.title} onChange={(v: string) => updateFeature(f.id, { title: v })} />
                              <Input label="Title (BN)" value={f.titleBn} onChange={(v: string) => updateFeature(f.id, { titleBn: v })} />
                              <Input label="Icon (Lucide)" value={f.icon} onChange={(v: string) => updateFeature(f.id, { icon: v })} />
                              <div className="md:col-span-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase mb-1.5 tracking-widest px-1">Description (EN)</label>
                                 <textarea value={f.description} onChange={(e) => updateFeature(f.id, { description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm h-24 focus:outline-none" />
                              </div>
                              <div className="md:col-span-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase mb-1.5 tracking-widest px-1">Description (BN)</label>
                                 <textarea value={f.descriptionBn} onChange={(e) => updateFeature(f.id, { descriptionBn: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm h-24 focus:outline-none" />
                              </div>
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
   const [expandedId, setExpandedId] = useState<string | null>(null);

   const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         const oldIndex = products.findIndex((i: any) => i.id === active.id);
         const newIndex = products.findIndex((i: any) => i.id === over.id);
         const newProducts = arrayMove(products, oldIndex, newIndex).map((p: any, i: number) => ({ ...p, order: i + 1 }));
         setProducts(newProducts);
      }
   };

   const addProduct = () => {
      const id = Date.now().toString();
      const newProduct: Product = {
         id,
         title: 'New Product',
         titleBn: 'নতুন পণ্য',
         subtitle: 'Premium Access',
         subtitleBn: 'প্রিমিয়াম অ্যাক্সেস',
         badge: 'New',
         badgeBn: 'নতুন',
         shortDescription: 'Description here',
         shortDescriptionBn: 'বিবরণ এখানে',
         buttonText: 'Buy Now',
         buttonTextBn: 'এখনই কিনুন',
         telegramLink: '#',
         image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
         visible: true,
         order: products.length + 1,
         plans: [],
         bulletPoints: [],
         features: []
      };
      setProducts([...products, newProduct]);
      setExpandedId(id);
   };

   const deleteProduct = (id: string) => {
      setProducts(products.filter((p: any) => p.id !== id));
   };

   const updateProduct = (id: string, updates: Partial<Product>) => {
      setProducts(products.map((p: any) => p.id === id ? { ...p, ...updates } : p));
   };

   return (
      <div className="space-y-10">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">Manage Products</h3>
            <button onClick={addProduct} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20">
               <Plus className="w-5 h-5" /> Create New Product
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={products.map((p: any) => p.id)} strategy={verticalListSortingStrategy}>
               <div className="space-y-6">
                  {products.map((p: Product) => (
                     <SortableItem key={p.id} id={p.id}>
                        <div className={`glass-card rounded-[40px] border-white/5 transition-all duration-500 ${expandedId === p.id ? 'ring-2 ring-primary/50' : ''}`}>
                           <div className="p-8 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                              <div className="pl-8 flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                    <img src={p.image} className="w-full h-full object-cover" />
                                 </div>
                                 <div>
                                    <h4 className="text-xl font-black">{p.title}</h4>
                                    <p className="text-sm text-text-muted font-medium">{p.subtitle}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <button onClick={(e) => { e.stopPropagation(); updateProduct(p.id, { visible: !p.visible }); }} className={`p-3 rounded-xl transition-all ${p.visible ? 'text-primary bg-primary/10' : 'text-text-muted bg-white/5'}`}>
                                    {p.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                 </button>
                                 <button onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }} className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                                 <div className="ml-4">
                                    {expandedId === p.id ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                                 </div>
                              </div>
                           </div>

                           <AnimatePresence>
                              {expandedId === p.id && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="px-8 pb-12 space-y-12 border-t border-white/5 pt-10">
                                       {/* Basic Info */}
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                          <div className="space-y-6">
                                             <Input label="Title (EN)" value={p.title} onChange={(v) => updateProduct(p.id, { title: v })} />
                                             <Input label="Title (BN)" value={p.titleBn} onChange={(v) => updateProduct(p.id, { titleBn: v })} />
                                             <Input label="Subtitle (EN)" value={p.subtitle} onChange={(v) => updateProduct(p.id, { subtitle: v })} />
                                             <Input label="Subtitle (BN)" value={p.subtitleBn} onChange={(v) => updateProduct(p.id, { subtitleBn: v })} />
                                          </div>
                                          <div className="space-y-6">
                                             <Input label="Badge (EN)" value={p.badge} onChange={(v) => updateProduct(p.id, { badge: v })} />
                                             <Input label="Badge (BN)" value={p.badgeBn} onChange={(v) => updateProduct(p.id, { badgeBn: v })} />
                                             <Input label="Product Image URL" value={p.image} onChange={(v) => updateProduct(p.id, { image: v })} />
                                             <Input label="Telegram Link" value={p.telegramLink} onChange={(v) => updateProduct(p.id, { telegramLink: v })} />
                                          </div>
                                          <div className="md:col-span-2">
                                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Short Description (EN)</label>
                                             <textarea value={p.shortDescription} onChange={(e) => updateProduct(p.id, { shortDescription: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm h-24 focus:outline-none focus:ring-1 focus:ring-primary" />
                                          </div>
                                          <div className="md:col-span-2">
                                             <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Short Description (BN)</label>
                                             <textarea value={p.shortDescriptionBn} onChange={(e) => updateProduct(p.id, { shortDescriptionBn: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-sm h-24 focus:outline-none focus:ring-1 focus:ring-primary" />
                                          </div>
                                       </div>

                                       {/* Pricing Plans */}
                                       <div className="space-y-6">
                                          <div className="flex justify-between items-center">
                                             <h5 className="font-black text-primary uppercase tracking-widest text-xs">Pricing Plans</h5>
                                             <button onClick={() => updateProduct(p.id, { plans: [...p.plans, { id: Date.now().toString(), name: 'New Plan', nameBn: 'নতুন প্ল্যান', priceTk: 0, duration: 'Monthly' }] })} className="text-primary font-bold text-xs flex items-center gap-2 px-4 py-2 hover:bg-primary/5 rounded-xl transition-all">
                                                <Plus className="w-4 h-4" /> Add Plan
                                             </button>
                                          </div>
                                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                             {p.plans.map((plan, idx) => (
                                                <div key={plan.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4 relative group">
                                                   <button onClick={() => updateProduct(p.id, { plans: p.plans.filter((_, i) => i !== idx) })} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                                                   <div className="grid grid-cols-2 gap-4">
                                                      <Input label="Name (EN)" value={plan.name} onChange={(v) => {
                                                         const newPlans = [...p.plans];
                                                         newPlans[idx].name = v;
                                                         updateProduct(p.id, { plans: newPlans });
                                                      }} />
                                                      <Input label="Name (BN)" value={plan.nameBn} onChange={(v) => {
                                                         const newPlans = [...p.plans];
                                                         newPlans[idx].nameBn = v;
                                                         updateProduct(p.id, { plans: newPlans });
                                                      }} />
                                                   </div>
                                                   <div className="grid grid-cols-2 gap-4">
                                                      <Input label="Price (TK)" value={plan.priceTk} type="number" onChange={(v) => {
                                                         const newPlans = [...p.plans];
                                                         newPlans[idx].priceTk = parseInt(v);
                                                         updateProduct(p.id, { plans: newPlans });
                                                      }} />
                                                      <div className="flex flex-col">
                                                         <label className="text-[10px] font-black text-text-muted uppercase mb-1.5 tracking-widest">Duration</label>
                                                         <select
                                                            value={plan.duration}
                                                            onChange={(e) => {
                                                               const newPlans = [...p.plans];
                                                               newPlans[idx].duration = e.target.value as any;
                                                               updateProduct(p.id, { plans: newPlans });
                                                            }}
                                                            className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold text-text-primary focus:outline-none"
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

                                       {/* Bullet Points */}
                                       <div className="space-y-6">
                                          <div className="flex justify-between items-center">
                                             <h5 className="font-black text-secondary uppercase tracking-widest text-xs">Bullet Points</h5>
                                             <button onClick={() => updateProduct(p.id, { bulletPoints: [...p.bulletPoints, { id: Date.now().toString(), text: 'New Point', textBn: 'নতুন পয়েন্ট', visible: true, order: p.bulletPoints.length + 1 }] })} className="text-secondary font-bold text-xs flex items-center gap-2 px-4 py-2 hover:bg-secondary/5 rounded-xl transition-all">
                                                <Plus className="w-4 h-4" /> Add Bullet Point
                                             </button>
                                          </div>
                                          <div className="space-y-4">
                                             {p.bulletPoints.map((bp, idx) => (
                                                <div key={bp.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                                                   <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                      <Input label="Text (EN)" value={bp.text} onChange={(v) => {
                                                         const newBps = [...p.bulletPoints];
                                                         newBps[idx].text = v;
                                                         updateProduct(p.id, { bulletPoints: newBps });
                                                      }} />
                                                      <Input label="Text (BN)" value={bp.textBn} onChange={(v) => {
                                                         const newBps = [...p.bulletPoints];
                                                         newBps[idx].textBn = v;
                                                         updateProduct(p.id, { bulletPoints: newBps });
                                                      }} />
                                                   </div>
                                                   <button onClick={() => {
                                                      const newBps = [...p.bulletPoints];
                                                      newBps[idx].visible = !newBps[idx].visible;
                                                      updateProduct(p.id, { bulletPoints: newBps });
                                                   }} className={`p-2 rounded-lg ${bp.visible ? 'text-primary' : 'text-text-muted'}`}>
                                                      {bp.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                   </button>
                                                   <button onClick={() => updateProduct(p.id, { bulletPoints: p.bulletPoints.filter((_, i) => i !== idx) })} className="p-2 text-red-400"><Trash2 className="w-5 h-5" /></button>
                                                </div>
                                             ))}
                                          </div>
                                       </div>

                                       {/* Features */}
                                       <div className="space-y-6">
                                          <div className="flex justify-between items-center">
                                             <h5 className="font-black text-warning uppercase tracking-widest text-xs">Featured Services</h5>
                                             <button onClick={() => updateProduct(p.id, { features: [...p.features, { id: Date.now().toString(), text: 'New Feature', textBn: 'নতুন ফিচার', available: true, visible: true, highlighted: false, order: p.features.length + 1 }] })} className="text-warning font-bold text-xs flex items-center gap-2 px-4 py-2 hover:bg-warning/5 rounded-xl transition-all">
                                                <Plus className="w-4 h-4" /> Add Feature
                                             </button>
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {p.features.map((f, idx) => (
                                                <div key={f.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                                                   <div className="grid grid-cols-1 gap-4">
                                                      <Input label="Feature (EN)" value={f.text} onChange={(v) => {
                                                         const newFs = [...p.features];
                                                         newFs[idx].text = v;
                                                         updateProduct(p.id, { features: newFs });
                                                      }} />
                                                      <Input label="Feature (BN)" value={f.textBn} onChange={(v) => {
                                                         const newFs = [...p.features];
                                                         newFs[idx].textBn = v;
                                                         updateProduct(p.id, { features: newFs });
                                                      }} />
                                                   </div>
                                                   <div className="grid grid-cols-2 gap-4">
                                                      <button onClick={() => {
                                                         const newFs = [...p.features];
                                                         newFs[idx].available = !newFs[idx].available;
                                                         updateProduct(p.id, { features: newFs });
                                                      }} className={`py-3 rounded-xl font-bold text-[10px] transition-all border ${f.available ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                                                         {f.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                                                      </button>
                                                      <button onClick={() => {
                                                         const newFs = [...p.features];
                                                         newFs[idx].highlighted = !newFs[idx].highlighted;
                                                         updateProduct(p.id, { features: newFs });
                                                      }} className={`py-3 rounded-xl font-bold text-[10px] transition-all border ${f.highlighted ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                                                         {f.highlighted ? 'HIGHLIGHTED' : 'STANDARD'}
                                                      </button>
                                                   </div>
                                                   <button onClick={() => updateProduct(p.id, { features: p.features.filter((_, i) => i !== idx) })} className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                                                      <Trash2 className="w-4 h-4" /> Remove Feature
                                                   </button>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     </SortableItem>
                  ))}
               </div>
            </SortableContext>
         </DndContext>
      </div>
   );
};

const ReviewsTab = ({ reviews, setReviews }: any) => {
   const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         const oldIndex = reviews.findIndex((i: any) => i.id === active.id);
         const newIndex = reviews.findIndex((i: any) => i.id === over.id);
         setReviews(arrayMove(reviews, oldIndex, newIndex).map((r: any, i: number) => ({ ...r, order: i + 1 })));
      }
   };

   const addReview = () => {
      const newReview: Review = {
         id: Date.now().toString(),
         name: 'New User',
         role: 'Customer',
         roleBn: 'ক্রেতা',
         image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now(),
         rating: 5,
         review: 'Excellent service!',
         reviewBn: 'অসাধারণ সার্ভিস!',
         featured: true,
         visible: true,
         order: reviews.length + 1
      };
      setReviews([...reviews, newReview]);
   };

   const updateReview = (id: string, updates: Partial<Review>) => {
      setReviews(reviews.map((r: any) => r.id === id ? { ...r, ...updates } : r));
   };

   const deleteReview = (id: string) => {
      setReviews(reviews.filter((r: any) => r.id !== id));
   };

   return (
      <div className="space-y-10">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">User Reviews</h3>
            <button onClick={addReview} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20">
               <Plus className="w-5 h-5" /> Add Review
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={reviews.map((r: any) => r.id)} strategy={verticalListSortingStrategy}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((r: Review) => (
                     <SortableItem key={r.id} id={r.id}>
                        <div className="glass-card p-8 rounded-[32px] border-white/5 space-y-6">
                           <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/5 border border-white/10">
                                 <img src={r.image} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                 <Input label="Name" value={r.name} onChange={(v) => updateReview(r.id, { name: v })} />
                              </div>
                              <div className="flex gap-2">
                                 <button onClick={() => updateReview(r.id, { visible: !r.visible })} className={`p-2.5 rounded-xl ${r.visible ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'}`}>
                                    {r.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                 </button>
                                 <button onClick={() => deleteReview(r.id)} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <Input label="Role (EN)" value={r.role} onChange={(v) => updateReview(r.id, { role: v })} />
                              <Input label="Role (BN)" value={r.roleBn} onChange={(v) => updateReview(r.id, { roleBn: v })} />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <Input label="Rating (1-5)" value={r.rating} type="number" onChange={(v) => updateReview(r.id, { rating: parseInt(v) })} />
                              <div className="flex flex-col">
                                 <label className="text-[10px] font-black text-text-muted uppercase mb-1.5 tracking-widest">Featured</label>
                                 <button onClick={() => updateReview(r.id, { featured: !r.featured })} className={`h-12 rounded-xl font-bold text-xs transition-all ${r.featured ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>
                                    {r.featured ? 'FEATURED' : 'STANDARD'}
                                 </button>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 gap-6">
                              <div className="md:col-span-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Review (EN)</label>
                                 <textarea value={r.review} onChange={(e) => updateReview(r.id, { review: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm h-24 focus:outline-none" />
                              </div>
                              <div className="md:col-span-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Review (BN)</label>
                                 <textarea value={r.reviewBn} onChange={(e) => updateReview(r.id, { reviewBn: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm h-24 focus:outline-none" />
                              </div>
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

const FAQTab = ({ faqs, setFAQs }: any) => {
   const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
         const oldIndex = faqs.findIndex((i: any) => i.id === active.id);
         const newIndex = faqs.findIndex((i: any) => i.id === over.id);
         setFAQs(arrayMove(faqs, oldIndex, newIndex).map((f: any, i: number) => ({ ...f, order: i + 1 })));
      }
   };

   const addFAQ = () => {
      const newFAQ: FAQ = {
         id: Date.now().toString(),
         q: 'New Question?',
         qBn: 'নতুন প্রশ্ন?',
         a: 'Answer content...',
         aBn: 'উত্তর এখানে...',
         visible: true,
         order: faqs.length + 1
      };
      setFAQs([...faqs, newFAQ]);
   };

   const updateFAQ = (id: string, updates: Partial<FAQ>) => {
      setFAQs(faqs.map((f: any) => f.id === id ? { ...f, ...updates } : f));
   };

   const deleteFAQ = (id: string) => {
      setFAQs(faqs.filter((f: any) => f.id !== id));
   };

   return (
      <div className="space-y-10">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">FAQ Items</h3>
            <button onClick={addFAQ} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-primary/20">
               <Plus className="w-5 h-5" /> Add Question
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={faqs.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
               <div className="space-y-6">
                  {faqs.map((f: FAQ) => (
                     <SortableItem key={f.id} id={f.id}>
                        <div className="glass-card p-8 rounded-[32px] border-white/5 space-y-8">
                           <div className="flex justify-between items-start">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black ml-10">?</div>
                              <div className="flex gap-2">
                                 <button onClick={() => updateFAQ(f.id, { visible: !f.visible })} className={`p-2.5 rounded-xl ${f.visible ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'}`}>
                                    {f.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                 </button>
                                 <button onClick={() => deleteFAQ(f.id)} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                 <Input label="Question (EN)" value={f.q} onChange={(v) => updateFAQ(f.id, { q: v })} />
                                 <div>
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Answer (EN)</label>
                                    <textarea value={f.a} onChange={(e) => updateFAQ(f.id, { a: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm h-32 focus:outline-none" />
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <Input label="Question (BN)" value={f.qBn} onChange={(v) => updateFAQ(f.id, { qBn: v })} />
                                 <div>
                                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Answer (BN)</label>
                                    <textarea value={f.aBn} onChange={(e) => updateFAQ(f.id, { aBn: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm h-32 focus:outline-none" />
                                 </div>
                              </div>
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

const CountdownTab = ({ countdown, updateCountdown }: any) => {
   return (
      <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
         <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">Promo Countdown</h3>
            <button onClick={() => updateCountdown({ ...countdown, enabled: !countdown.enabled })} className={`px-8 py-3 rounded-2xl font-black text-xs transition-all ${countdown.enabled ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>
               {countdown.enabled ? 'ACTIVE' : 'DISABLED'}
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
               <Input label="Target Date (Format: YYYY-MM-DDTHH:mm:ss)" value={countdown.targetDate} onChange={(v) => updateCountdown({ ...countdown, targetDate: v })} />
               <p className="text-[10px] text-text-muted mt-2 uppercase font-bold tracking-widest">Current System Time: {new Date().toISOString()}</p>
            </div>
            <Input label="Title (EN)" value={countdown.title} onChange={(v) => updateCountdown({ ...countdown, title: v })} />
            <Input label="Title (BN)" value={countdown.titleBn} onChange={(v) => updateCountdown({ ...countdown, titleBn: v })} />
            <Input label="Subtitle (EN)" value={countdown.subtitle} onChange={(v) => updateCountdown({ ...countdown, subtitle: v })} />
            <Input label="Subtitle (BN)" value={countdown.subtitleBn} onChange={(v) => updateCountdown({ ...countdown, subtitleBn: v })} />
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
      setPricingFeatures([...pricingFeatures, { 
         id: Date.now().toString(), 
         text: 'New Feature', 
         textBn: 'নতুন ফিচার', 
         available: true, 
         visible: true, 
         order: pricingFeatures.length + 1,
         highlighted: false
      }]);
   };

   const removeFeature = (id: string) => {
      setPricingFeatures(pricingFeatures.filter((f: any) => f.id !== id));
   };

   const updateFeature = (id: string, updates: any) => {
      setPricingFeatures(pricingFeatures.map((f: any) => f.id === id ? { ...f, ...updates } : f));
   };

   return (
      <div className="space-y-10">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">Feature Comparison Manager</h3>
            <button onClick={addFeature} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95">
               <Plus className="w-5 h-5" /> Add Comparison Feature
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pricingFeatures.map((f: any) => f.id)} strategy={verticalListSortingStrategy}>
               <div className="space-y-4">
                  {pricingFeatures.map((f: any) => (
                     <SortableItem key={f.id} id={f.id}>
                        <div className="glass-card p-8 rounded-[32px] border-white/5 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative group">
                           <div className="md:col-span-4 grid grid-cols-1 gap-4">
                              <Input label="Feature (EN)" value={f.text} onChange={(v: string) => updateFeature(f.id, { text: v })} />
                              <Input label="Feature (BN)" value={f.textBn} onChange={(v: string) => updateFeature(f.id, { textBn: v })} />
                           </div>

                           <div className="md:col-span-5 grid grid-cols-2 gap-4">
                              <div className="flex flex-col">
                                 <label className="text-[10px] font-black text-text-muted uppercase mb-2 tracking-widest px-1">Availability</label>
                                 <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                    <button 
                                       onClick={() => updateFeature(f.id, { available: true })}
                                       className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black transition-all ${f.available ? 'bg-success text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                                    >
                                       <Check className="w-3 h-3" /> AVAILABLE
                                    </button>
                                    <button 
                                       onClick={() => updateFeature(f.id, { available: false })}
                                       className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black transition-all ${!f.available ? 'bg-red-500 text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
                                    >
                                       <X className="w-3 h-3" /> UNAVAILABLE
                                    </button>
                                 </div>
                              </div>
                              <div className="flex flex-col">
                                 <label className="text-[10px] font-black text-text-muted uppercase mb-2 tracking-widest px-1">Style</label>
                                 <button 
                                    onClick={() => updateFeature(f.id, { highlighted: !f.highlighted })}
                                    className={`h-[46px] rounded-xl font-black text-[10px] tracking-widest transition-all border ${f.highlighted ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white/5 text-text-muted border-white/10'}`}
                                 >
                                    {f.highlighted ? 'HIGHLIGHTED' : 'STANDARD'}
                                 </button>
                              </div>
                           </div>

                           <div className="md:col-span-3 flex items-center justify-end gap-3">
                              <button onClick={() => updateFeature(f.id, { visible: !f.visible })} className={`p-3.5 rounded-xl transition-all ${f.visible ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'}`}>
                                 {f.visible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                              </button>
                              <button onClick={() => removeFeature(f.id)} className="p-3.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
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

const PaymentTab = ({ paymentSettings, updatePaymentSettings, paymentMethods, setPaymentMethods }: any) => {
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
      setPaymentMethods([...paymentMethods, {
         id: Date.now().toString(),
         name: 'New Method',
         type: 'Personal',
         number: '',
         accountName: '',
         qrCode: '',
         instructions: '',
         enabled: true,
         icon: 'wallet',
         order: paymentMethods.length + 1
      }]);
   };

   const updateMethod = (id: string, updates: any) => {
      setPaymentMethods(paymentMethods.map((m: any) => m.id === id ? { ...m, ...updates } : m));
   };

   const deleteMethod = (id: string) => {
      setPaymentMethods(paymentMethods.filter((m: any) => m.id !== id));
   };

   return (
      <div className="space-y-12">
         <div className="flex justify-between items-center">
            <h3 className="text-xl font-black">Payment Method Manager</h3>
            <button onClick={addMethod} className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
               <Plus className="w-5 h-5" /> Add Payment Method
            </button>
         </div>

         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={paymentMethods.map((m: any) => m.id)} strategy={verticalListSortingStrategy}>
               <div className="space-y-6">
                  {paymentMethods.map((m: any) => (
                     <SortableItem key={m.id} id={m.id}>
                        <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10 relative group">
                           <div className="flex justify-between items-center pb-6 border-b border-white/5">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase tracking-widest text-lg ml-8">
                                    {m.name[0]}
                                 </div>
                                 <div>
                                    <h4 className="font-black text-xl">{m.name}</h4>
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[2px]">{m.type}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button onClick={() => updateMethod(m.id, { enabled: !m.enabled })} className={`px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest transition-all border ${m.enabled ? 'bg-success/10 text-success border-success/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
                                    {m.enabled ? 'ENABLED' : 'DISABLED'}
                                 </button>
                                 <button onClick={() => deleteMethod(m.id)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <Input label="Method Name" value={m.name} onChange={(v) => updateMethod(m.id, { name: v })} />
                              <Input label="Account Type" value={m.type} onChange={(v) => updateMethod(m.id, { type: v })} />
                              <Input label="Icon Name" value={m.icon} onChange={(v) => updateMethod(m.id, { icon: v })} />
                              <Input label="Account Number" value={m.number} onChange={(v) => updateMethod(m.id, { number: v })} />
                              <Input label="Account Name" value={m.accountName} onChange={(v) => updateMethod(m.id, { accountName: v })} />
                              <Input label="QR Code URL" value={m.qrCode} onChange={(v) => updateMethod(m.id, { qrCode: v })} />
                           </div>

                           <div>
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px] mb-3 block">Payment Instructions</label>
                              <textarea 
                                 value={m.instructions} 
                                 onChange={(e) => updateMethod(m.id, { instructions: e.target.value })} 
                                 className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 text-sm h-32 focus:outline-none" 
                                 placeholder="Enter step-by-step instructions..."
                              />
                           </div>
                        </div>
                     </SortableItem>
                  ))}
               </div>
            </SortableContext>
         </DndContext>

         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
            <h3 className="text-xl font-black text-red-400">Global Payment Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Currency Symbol" value={paymentSettings.currency} onChange={(v) => updatePaymentSettings({ ...paymentSettings, currency: v })} />
               <Input label="Telegram Contact Link" value={paymentSettings.telegramLink} onChange={(v) => updatePaymentSettings({ ...paymentSettings, telegramLink: v })} />
               <Input label="Global Warning (EN)" value={paymentSettings.warningText} onChange={(v) => updatePaymentSettings({ ...paymentSettings, warningText: v })} />
               <Input label="Global Warning (BN)" value={paymentSettings.warningTextBn} onChange={(v) => updatePaymentSettings({ ...paymentSettings, warningTextBn: v })} />
            </div>
         </div>
      </div>
   );
};

const FooterTab = ({ footer, updateFooter }: any) => {
   return (
      <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-10">
         <h3 className="text-xl font-black">Footer Management</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input label="Copyright Text (EN)" value={footer.copyright} onChange={(v) => updateFooter({ ...footer, copyright: v })} />
            <Input label="Copyright Text (BN)" value={footer.copyrightBn} onChange={(v) => updateFooter({ ...footer, copyrightBn: v })} />
         </div>

         <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h4 className="text-xs font-black text-primary uppercase tracking-widest">Footer Links</h4>
               <button onClick={() => updateFooter({ ...footer, links: [...footer.links, { label: 'New Link', labelBn: 'নতুন লিঙ্ক', url: '#' }] })} className="text-primary font-bold text-xs flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Link
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {footer.links.map((link: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative group">
                     <button onClick={() => updateFooter({ ...footer, links: footer.links.filter((_: any, i: number) => i !== idx) })} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                     <Input label="Label (EN)" value={link.label} onChange={(v) => {
                        const newLinks = [...footer.links];
                        newLinks[idx].label = v;
                        updateFooter({ ...footer, links: newLinks });
                     }} />
                     <Input label="Label (BN)" value={link.labelBn} onChange={(v) => {
                        const newLinks = [...footer.links];
                        newLinks[idx].labelBn = v;
                        updateFooter({ ...footer, links: newLinks });
                     }} />
                     <Input label="URL" value={link.url} onChange={(v) => {
                        const newLinks = [...footer.links];
                        newLinks[idx].url = v;
                        updateFooter({ ...footer, links: newLinks });
                     }} />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

const SettingsTab = ({ settings, updateSettings, pixelSettings, updatePixelSettings, trustBadges, setTrustBadges }: any) => {
   return (
      <div className="space-y-10">
         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
            <h3 className="text-xl font-black">General Platform Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Input label="Site Name (EN)" value={settings.siteName} onChange={(v) => updateSettings({ ...settings, siteName: v })} />
               <Input label="Site Name (BN)" value={settings.siteNameBn} onChange={(v) => updateSettings({ ...settings, siteNameBn: v })} />
               <Input label="Logo Text / Initial" value={settings.logo} onChange={(v) => updateSettings({ ...settings, logo: v })} />
               <Input label="Global Telegram Handle" value={settings.telegramHandle} onChange={(v) => updateSettings({ ...settings, telegramHandle: v })} />
               <Input label="Global Telegram Link" value={settings.telegramLink} onChange={(v) => updateSettings({ ...settings, telegramLink: v })} />
               <Input label="Floating CTA (EN)" value={settings.floatingCTA} onChange={(v) => updateSettings({ ...settings, floatingCTA: v })} />
               <Input label="Floating CTA (BN)" value={settings.floatingCTABn} onChange={(v) => updateSettings({ ...settings, floatingCTABn: v })} />
            </div>
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black">Tracking & Pixels</h3>
               <button onClick={() => updatePixelSettings({ ...pixelSettings, enabled: !pixelSettings.enabled })} className={`px-6 py-3 rounded-2xl font-black text-xs transition-all ${pixelSettings.enabled ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>
                  {pixelSettings.enabled ? 'PIXEL ON' : 'PIXEL OFF'}
               </button>
            </div>
            <div className="max-w-md">
               <Input label="Facebook Pixel ID" value={pixelSettings.pixelId} onChange={(v) => updatePixelSettings({ ...pixelSettings, pixelId: v })} />
            </div>
         </div>

         <div className="glass-card p-10 rounded-[40px] border-white/5 space-y-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-black">Trust Badges</h3>
               <button onClick={() => setTrustBadges([...trustBadges, { id: Date.now().toString(), text: 'Secure', textBn: 'নিরাপদ', icon: 'Shield', visible: true, order: trustBadges.length + 1 }])} className="text-primary font-bold text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Badge
               </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {trustBadges.map((badge: any, idx: number) => (
                  <div key={badge.id} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative group">
                     <button onClick={() => setTrustBadges(trustBadges.filter((_: any, i: number) => i !== idx))} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                     <Input label="Text (EN)" value={badge.text} onChange={(v) => {
                        const newBadges = [...trustBadges];
                        newBadges[idx].text = v;
                        setTrustBadges(newBadges);
                     }} />
                     <Input label="Text (BN)" value={badge.textBn} onChange={(v) => {
                        const newBadges = [...trustBadges];
                        newBadges[idx].textBn = v;
                        setTrustBadges(newBadges);
                     }} />
                     <Input label="Icon Name (Lucide)" value={badge.icon} onChange={(v) => {
                        const newBadges = [...trustBadges];
                        newBadges[idx].icon = v;
                        setTrustBadges(newBadges);
                     }} />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

// Reusable Components
const Input = ({ label, value, onChange, type = 'text', placeholder = '' }: any) => (
   <div className="flex flex-col">
      <label className="text-[10px] font-black text-text-muted uppercase mb-2 tracking-[1.5px] px-1">{label}</label>
      <input
         type={type}
         value={value}
         onChange={(e) => onChange(e.target.value)}
         placeholder={placeholder}
         className="h-14 bg-white/5 border border-white/10 rounded-[20px] px-6 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all font-bold placeholder:text-text-muted/30"
      />
   </div>
);

const MenuIcon = () => (
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>
);
