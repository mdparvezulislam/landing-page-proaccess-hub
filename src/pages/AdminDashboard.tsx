import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
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
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const {
    setAdminStatus,
    language,
    setLanguage,
    products,
    updateProduct,
    hero,
    updateHero,
    faqs,
    addFAQ,
    updateFAQ,
    deleteFAQ,
    orders,
    updateOrderStatus,
    deleteOrder,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    settings,
    updateSettings,
    paymentSettings,
    updatePaymentSettings,
    pixelSettings,
    updatePixelSettings,
    countdown,
    updateCountdown
  } = useStore();

  const handleLogout = () => {
    setAdminStatus(false);
    navigate('/');
    toast.info('Logged out from Admin Dashboard');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section', icon: Type },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#020617]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 fixed left-0 top-20 bottom-0 bg-[#0F172A] border-r border-white/5 overflow-y-auto hidden lg:block">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">A</div>
              <span className="font-bold text-lg">Admin Panel</span>
            </div>

            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.id === 'orders' && orders.filter(o => o.status === 'Pending').length > 0 && (
                    <span className="ml-auto bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                      {orders.filter(o => o.status === 'Pending').length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 p-6 lg:p-12">
          <header className="mb-12">
            <h1 className="text-3xl font-black text-text-primary mb-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-text-secondary">Manage your platform content and operations.</p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <OverviewTab orders={orders} products={products} />
              )}
              {activeTab === 'hero' && (
                <HeroTab hero={hero} updateHero={updateHero} />
              )}
              {activeTab === 'products' && (
                <ProductsTab products={products} updateProduct={updateProduct} />
              )}
              {activeTab === 'orders' && (
                <OrdersTab orders={orders} updateOrderStatus={updateOrderStatus} deleteOrder={deleteOrder} />
              )}
              {activeTab === 'reviews' && (
                <ReviewsTab reviews={reviews} addReview={addReview} updateReview={updateReview} deleteReview={deleteReview} />
              )}
              {activeTab === 'faq' && (
                <FAQTab faqs={faqs} addFAQ={addFAQ} updateFAQ={updateFAQ} deleteFAQ={deleteFAQ} />
              )}
              {activeTab === 'settings' && (
                <SettingsTab
                  settings={settings}
                  updateSettings={updateSettings}
                  paymentSettings={paymentSettings}
                  updatePaymentSettings={updatePaymentSettings}
                  pixelSettings={pixelSettings}
                  updatePixelSettings={updatePixelSettings}
                  countdown={countdown}
                  updateCountdown={updateCountdown}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Sub-components for Tabs ---

const OverviewTab = ({ orders, products }: any) => {
  const stats = [
    { label: 'Total Sales', value: `${orders.filter((o: any) => o.status === 'Completed').reduce((acc: number, o: any) => acc + o.amount, 0)} TK`, icon: DollarSign, color: 'text-success' },
    { label: 'Pending Orders', value: orders.filter((o: any) => o.status === 'Pending').length, icon: ShoppingCart, color: 'text-warning' },
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary' },
    { label: 'Total Orders', value: orders.length, icon: Bell, color: 'text-secondary' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-black text-text-primary mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order: any) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${order.status === 'Completed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                  }`}>
                  {order.customerName[0]}
                </div>
                <div>
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-xs text-text-muted">{order.productName} - {order.plan}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{order.amount} TK</p>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">{order.status}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-text-muted py-8">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
};

const HeroTab = ({ hero, updateHero }: any) => {
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [content, setContent] = useState(hero[lang]);

  const handleSave = () => {
    updateHero(lang, content);
    toast.success(`Hero (${lang}) updated successfully`);
  };

  return (
    <div className="glass-card p-8 rounded-2xl space-y-8">
      <div className="flex gap-4 p-1 bg-white/5 rounded-xl w-fit">
        <button onClick={() => setLang('en')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-white text-black' : 'text-text-muted hover:text-text-primary'}`}>English</button>
        <button onClick={() => setLang('bn')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'bn' ? 'bg-white text-black' : 'text-text-muted hover:text-text-primary'}`}>Bangla</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Badge" value={content.badge} onChange={(v) => setContent({ ...content, badge: v })} />
        <Input label="Title Main" value={content.title} onChange={(v) => setContent({ ...content, title: v })} />
        <Input label="Title Accent" value={content.titleAccent} onChange={(v) => setContent({ ...content, titleAccent: v })} />
        <Input label="Subtitle" value={content.subtitle} onChange={(v) => setContent({ ...content, subtitle: v })} />
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Description</label>
          <textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary h-24"
          />
        </div>
        <Input label="CTA Primary" value={content.cta1} onChange={(v) => setContent({ ...content, cta1: v })} />
        <Input label="CTA Secondary" value={content.cta2} onChange={(v) => setContent({ ...content, cta2: v })} />
      </div>

      <button onClick={handleSave} className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all">
        <Save className="w-5 h-5" /> Save Changes
      </button>
    </div>
  );
};

const ProductsTab = ({ products, updateProduct }: any) => {
  return (
    <div className="space-y-8">
      {products.map((p: any) => (
        <div key={p.id} className="glass-card p-8 rounded-2xl">
          <h3 className="text-xl font-black mb-6 text-primary">{p.nameEn}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Input label="Name (EN)" value={p.nameEn} onChange={(v) => updateProduct(p.id, { ...p, nameEn: v })} />
            <Input label="Name (BN)" value={p.nameBn} onChange={(v) => updateProduct(p.id, { ...p, nameBn: v })} />
            <Input label="Description (EN)" value={p.descriptionEn} onChange={(v) => updateProduct(p.id, { ...p, descriptionEn: v })} />
            <Input label="Description (BN)" value={p.descriptionBn} onChange={(v) => updateProduct(p.id, { ...p, descriptionBn: v })} />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">Pricing Plans</label>
            <div className="space-y-4">
              {p.plans.map((plan: any, i: number) => (
                <div key={i} className="grid grid-cols-3 gap-4 bg-white/5 p-4 rounded-xl items-end">
                  <Input label="Plan Name" value={plan.name} onChange={(v) => {
                    const newPlans = [...p.plans];
                    newPlans[i].name = v;
                    updateProduct(p.id, { ...p, plans: newPlans });
                  }} />
                  <Input label="Price (TK)" value={plan.priceTk} type="number" onChange={(v) => {
                    const newPlans = [...p.plans];
                    newPlans[i].priceTk = parseInt(v);
                    updateProduct(p.id, { ...p, plans: newPlans });
                  }} />
                  <div className="flex gap-2">
                    <button onClick={() => {
                      const newPlans = p.plans.filter((_: any, idx: number) => idx !== i);
                      updateProduct(p.id, { ...p, plans: newPlans });
                    }} className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
              <button onClick={() => {
                const newPlans = [...p.plans, { name: 'New Plan', priceTk: 0, duration: 'Monthly' }];
                updateProduct(p.id, { ...p, plans: newPlans });
              }} className="text-primary-light font-bold flex items-center gap-2 px-4 py-2 hover:bg-primary/5 rounded-lg transition-all">
                <Plus className="w-4 h-4" /> Add Plan
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const OrdersTab = ({ orders, updateOrderStatus, deleteOrder }: any) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="p-6 text-xs font-bold uppercase text-text-muted">Customer</th>
              <th className="p-6 text-xs font-bold uppercase text-text-muted">Product</th>
              <th className="p-6 text-xs font-bold uppercase text-text-muted">Amount</th>
              <th className="p-6 text-xs font-bold uppercase text-text-muted">Transaction ID</th>
              <th className="p-6 text-xs font-bold uppercase text-text-muted">Status</th>
              <th className="p-6 text-xs font-bold uppercase text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((o: any) => (
              <tr key={o.id} className="hover:bg-white/[0.02]">
                <td className="p-6">
                  <p className="font-bold text-text-primary">{o.customerName}</p>
                  <p className="text-xs text-text-muted">@{o.telegramUsername}</p>
                </td>
                <td className="p-6">
                  <p className="text-sm font-medium">{o.productName}</p>
                  <p className="text-[10px] uppercase font-black text-primary-light">{o.plan}</p>
                </td>
                <td className="p-6 font-bold">{o.amount} TK</td>
                <td className="p-6">
                  <button 
                    onClick={() => setSelectedOrder(o)}
                    className="font-mono text-xs text-primary-light hover:underline"
                  >
                    {o.transactionId}
                  </button>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'Completed' ? 'bg-success/20 text-success' :
                      o.status === 'Rejected' ? 'bg-red-500/20 text-red-400' : 'bg-warning/20 text-warning'
                    }`}>
                    {o.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex gap-2">
                    <button onClick={() => updateOrderStatus(o.id, 'Completed')} className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-all" title="Approve"><Check className="w-4 h-4" /></button>
                    <button onClick={() => updateOrderStatus(o.id, 'Rejected')} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all" title="Reject"><X className="w-4 h-4" /></button>
                    <button onClick={() => deleteOrder(o.id)} className="p-2 bg-white/5 text-text-muted rounded-lg hover:text-red-400 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-text-muted">No orders found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-2xl bg-[#0F172A] rounded-[32px] border border-white/10 overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-text-muted transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-black mb-8">Order Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Customer</p>
                      <p className="font-bold text-lg">{selectedOrder.customerName}</p>
                      <p className="text-primary-light font-medium">@{selectedOrder.telegramUsername}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Product & Plan</p>
                      <p className="font-bold">{selectedOrder.productName}</p>
                      <p className="text-sm text-text-secondary">{selectedOrder.plan}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Transaction ID</p>
                      <p className="font-mono text-xl font-bold text-primary">{selectedOrder.transactionId}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[200px]">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Payment Proof</p>
                    {selectedOrder.screenshotUrl ? (
                      <img 
                        src={selectedOrder.screenshotUrl} 
                        alt="Screenshot" 
                        className="max-h-[300px] rounded-xl object-contain shadow-2xl"
                        onError={(e: any) => { e.target.src = 'https://via.placeholder.com/400x600?text=Invalid+Image+URL'; }}
                      />
                    ) : (
                      <div className="text-center">
                        <X className="w-12 h-12 text-white/10 mx-auto mb-2" />
                        <p className="text-sm text-text-muted">No screenshot provided</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Completed'); setSelectedOrder(null); }}
                    className="flex-1 bg-success text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  >
                    <Check className="w-5 h-5" /> Approve
                  </button>
                  <button 
                    onClick={() => { updateOrderStatus(selectedOrder.id, 'Rejected'); setSelectedOrder(null); }}
                    className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  >
                    <X className="w-5 h-5" /> Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReviewsTab = ({ reviews, addReview, updateReview, deleteReview }: any) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">User Testimonials</h2>
        <button onClick={() => addReview({ id: Date.now().toString(), name: 'New Review', role: 'User', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Date.now(), rating: 5, review: 'Fantastic service!', featured: true })} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all">
          <Plus className="w-5 h-5" /> Add New Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((r: any) => (
          <div key={r.id} className="glass-card p-6 rounded-2xl relative border-white/5">
            <button onClick={() => deleteReview(r.id)} className="absolute top-4 right-4 text-text-muted hover:text-red-400 p-2"><Trash2 className="w-5 h-5" /></button>
            <div className="flex items-center gap-4 mb-6">
              <img src={r.image} className="w-12 h-12 rounded-full bg-white/5 border border-white/10" />
              <div className="flex-1">
                <Input label="Name" value={r.name} onChange={(v) => updateReview(r.id, { ...r, name: v })} />
              </div>
            </div>
            <div className="space-y-4">
              <Input label="Role" value={r.role} onChange={(v) => updateReview(r.id, { ...r, role: v })} />
              <Input label="Image URL" value={r.image} onChange={(v) => updateReview(r.id, { ...r, image: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Rating (1-5)" type="number" value={r.rating} onChange={(v) => updateReview(r.id, { ...r, rating: parseInt(v) })} />
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 tracking-widest">Featured</label>
                  <button onClick={() => updateReview(r.id, { ...r, featured: !r.featured })} className={`h-12 rounded-xl font-bold text-sm transition-all ${r.featured ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted border border-white/10'}`}>
                    {r.featured ? 'Featured' : 'Not Featured'}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 tracking-widest">Review Content</label>
                <textarea
                  value={r.review}
                  onChange={(e) => updateReview(r.id, { ...r, review: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary h-24 focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FAQTab = ({ faqs, addFAQ, updateFAQ, deleteFAQ }: any) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        <button onClick={() => addFAQ({ id: Date.now().toString(), q: 'New Question?', qBn: 'নতুন প্রশ্ন?', a: 'Answer here.', aBn: 'উত্তর এখানে।' })} className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-light transition-all">
          <Plus className="w-5 h-5" /> Add New FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((f: any) => (
          <div key={f.id} className="glass-card p-6 rounded-2xl border-white/5">
            <div className="flex justify-between items-start mb-6">
              <h4 className="font-bold text-primary">FAQ Item</h4>
              <button onClick={() => deleteFAQ(f.id)} className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input label="Question (EN)" value={f.q} onChange={(v) => updateFAQ(f.id, { ...f, q: v })} />
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 tracking-widest">Answer (EN)</label>
                  <textarea value={f.a} onChange={(e) => updateFAQ(f.id, { ...f, a: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm h-24" />
                </div>
              </div>
              <div className="space-y-4">
                <Input label="Question (BN)" value={f.qBn} onChange={(v) => updateFAQ(f.id, { ...f, qBn: v })} />
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1.5 tracking-widest">Answer (BN)</label>
                  <textarea value={f.aBn} onChange={(e) => updateFAQ(f.id, { ...f, aBn: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm h-24" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsTab = ({ settings, updateSettings, paymentSettings, updatePaymentSettings, pixelSettings, updatePixelSettings, countdown, updateCountdown }: any) => {
  return (
    <div className="space-y-8 pb-20">
      {/* Site Info */}
      <div className="glass-card p-8 rounded-2xl border-white/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> Site Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Site Name (EN)" value={settings.siteName} onChange={(v) => updateSettings({ ...settings, siteName: v })} />
          <Input label="Site Name (BN)" value={settings.siteNameBn} onChange={(v) => updateSettings({ ...settings, siteNameBn: v })} />
          <Input label="Telegram Link" value={settings.telegramLink} onChange={(v) => updateSettings({ ...settings, telegramLink: v })} />
          <Input label="Telegram Handle" value={settings.telegramHandle} onChange={(v) => updateSettings({ ...settings, telegramHandle: v })} />
        </div>
      </div>

      {/* Payment Settings */}
      <div className="glass-card p-8 rounded-2xl border-white/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><DollarSign className="w-5 h-5 text-success" /> Payment Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Method Name" value={paymentSettings.methodName} onChange={(v) => updatePaymentSettings({ ...paymentSettings, methodName: v })} />
          <Input label="Account Number" value={paymentSettings.number} onChange={(v) => updatePaymentSettings({ ...paymentSettings, number: v })} />
          <Input label="Account Type (Personal/Merchant)" value={paymentSettings.accountType} onChange={(v) => updatePaymentSettings({ ...paymentSettings, accountType: v })} />
          <Input label="QR Code URL" value={paymentSettings.qrCode} onChange={(v) => updatePaymentSettings({ ...paymentSettings, qrCode: v })} />
          <div className="md:col-span-2">
            <Input label="Warning Text" value={paymentSettings.warningText} onChange={(v) => updatePaymentSettings({ ...paymentSettings, warningText: v })} />
          </div>
          <div className="md:col-span-2">
            <Input label="Instructions Title" value={paymentSettings.instructionTitle} onChange={(v) => updatePaymentSettings({ ...paymentSettings, instructionTitle: v })} />
          </div>
          <div className="md:col-span-2 space-y-4">
             <label className="text-[10px] font-black text-text-muted uppercase tracking-[2px]">Payment Instructions (One per line)</label>
             <textarea 
               value={paymentSettings.instructions.join('\n')}
               onChange={(e) => updatePaymentSettings({ ...paymentSettings, instructions: e.target.value.split('\n').filter(l => l.trim() !== '') })}
               className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm h-32 focus:ring-1 focus:ring-primary focus:outline-none font-medium"
             />
          </div>
        </div>
      </div>

      {/* Facebook Pixel */}
      <div className="glass-card p-8 rounded-2xl border-white/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Languages className="w-5 h-5 text-blue-400" /> Facebook Pixel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <Input label="Pixel ID" value={pixelSettings.pixelId} onChange={(v) => updatePixelSettings({ ...pixelSettings, pixelId: v })} />
          <button
            onClick={() => updatePixelSettings({ ...pixelSettings, enabled: !pixelSettings.enabled })}
            className={`h-12 rounded-xl font-bold transition-all ${pixelSettings.enabled ? 'bg-success/10 text-success border border-success/20' : 'bg-white/5 text-text-muted border border-white/10'}`}
          >
            {pixelSettings.enabled ? 'Pixel Enabled' : 'Pixel Disabled'}
          </button>
        </div>
      </div>

      {/* Countdown */}
      <div className="glass-card p-8 rounded-2xl border-white/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-warning" /> Countdown Timer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Target Date (ISO)" value={countdown.targetDate} onChange={(v) => updateCountdown({ ...countdown, targetDate: v })} />
          <Input label="Title (EN)" value={countdown.title} onChange={(v) => updateCountdown({ ...countdown, title: v })} />
          <Input label="Title (BN)" value={countdown.titleBn} onChange={(v) => updateCountdown({ ...countdown, titleBn: v })} />
          <Input label="Subtitle (EN)" value={countdown.subtitle} onChange={(v) => updateCountdown({ ...countdown, subtitle: v })} />
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const Input = ({ label, value, onChange, type = 'text' }: any) => (
  <div className="flex flex-col">
    <label className="text-[10px] font-black text-text-muted uppercase mb-1.5 tracking-[1.5px]">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all font-medium"
    />
  </div>
);

