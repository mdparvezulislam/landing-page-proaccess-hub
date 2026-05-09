import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

export interface ProductPlan {
  id: string;
  name: string;
  nameBn: string;
  priceTk: number;
  priceUsd?: number;
  duration: 'Monthly' | 'Yearly' | 'Lifetime';
}

export interface BulletPoint {
  id: string;
  text: string;
  textBn: string;
  visible: boolean;
  order: number;
  icon?: string;
}

export interface Feature {
  id: string;
  text: string;
  textBn: string;
  visible: boolean;
  highlighted: boolean;
  order: number;
}

export interface Product {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  badge: string;
  badgeBn: string;
  shortDescription: string;
  shortDescriptionBn: string;
  buttonText: string;
  buttonTextBn: string;
  telegramLink: string;
  image: string;
  visible: boolean;
  order: number;
  plans: ProductPlan[];
  bulletPoints: BulletPoint[];
  features: Feature[];
}

export interface FAQ {
  id: string;
  q: string;
  qBn: string;
  a: string;
  aBn: string;
  visible: boolean;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  roleBn: string;
  image: string;
  rating: number;
  review: string;
  reviewBn: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface HeroContent {
  badge: string;
  badgeBn: string;
  title: string;
  titleBn: string;
  titleAccent: string;
  titleAccentBn: string;
  subtitle: string;
  subtitleBn: string;
  description: string;
  descriptionBn: string;
  cta1: string;
  cta1Bn: string;
  cta2: string;
  cta2Bn: string;
  backgroundImage: string;
  announcement: string;
  announcementBn: string;
  showAnnouncement: boolean;
  stats: {
    label: string;
    labelBn: string;
    value: string;
    valueBn: string;
  }[];
}

export interface SiteSettings {
  siteName: string;
  siteNameBn: string;
  telegramLink: string;
  telegramHandle: string;
  floatingCTA: string;
  floatingCTABn: string;
  logo: string;
}

export interface CountdownSettings {
  enabled: boolean;
  targetDate: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
}

export interface PaymentSettings {
  methodName: string;
  number: string;
  accountType: string;
  accountTypeBn: string;
  instructionTitle: string;
  instructionTitleBn: string;
  instructions: string[];
  instructionsBn: string[];
  qrCode: string;
  telegramLink: string;
  warningText: string;
  warningTextBn: string;
  currency: string;
}

export interface FooterSettings {
  copyright: string;
  copyrightBn: string;
  links: { label: string; labelBn: string; url: string }[];
}

export interface GlobalFeature {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  icon: string;
  visible: boolean;
  order: number;
}

export interface NavbarMenu {
  items: { label: string; labelBn: string; url: string; order: number }[];
}

export interface TrustBadge {
  id: string;
  text: string;
  textBn: string;
  icon: string;
  visible: boolean;
  order: number;
}

export interface PixelSettings {
  enabled: boolean;
  pixelId: string;
}

export interface Order {
  id: string;
  productName: string;
  plan: string;
  amount: number;
  customerName: string;
  telegramUsername: string;
  paymentNumber: string;
  transactionId: string;
  screenshotUrl: string;
  status: 'Pending' | 'Completed' | 'Rejected';
  createdAt: string;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdmin: boolean;
  setAdminStatus: (status: boolean) => void;

  hero: HeroContent;
  updateHero: (hero: HeroContent) => void;

  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;

  faqs: FAQ[];
  setFAQs: (faqs: FAQ[]) => void;
  addFAQ: (faq: FAQ) => void;
  updateFAQ: (id: string, faq: FAQ) => void;
  deleteFAQ: (id: string) => void;

  reviews: Review[];
  setReviews: (reviews: Review[]) => void;
  addReview: (review: Review) => void;
  updateReview: (id: string, review: Review) => void;
  deleteReview: (id: string) => void;

  countdown: CountdownSettings;
  updateCountdown: (countdown: CountdownSettings) => void;

  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: PaymentSettings) => void;

  settings: SiteSettings;
  updateSettings: (settings: SiteSettings) => void;

  footer: FooterSettings;
  updateFooter: (footer: FooterSettings) => void;

  pricingFeatures: { id: string; text: string; textBn: string }[];
  setPricingFeatures: (features: { id: string; text: string; textBn: string }[]) => void;

  globalFeatures: GlobalFeature[];
  setGlobalFeatures: (features: GlobalFeature[]) => void;

  navbar: NavbarMenu;
  updateNavbar: (navbar: NavbarMenu) => void;

  trustBadges: TrustBadge[];
  setTrustBadges: (badges: TrustBadge[]) => void;

  pixelSettings: PixelSettings;
  updatePixelSettings: (settings: PixelSettings) => void;

  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Order) => void;
  deleteOrder: (id: string) => void;

  // Runtime state
  selectedOrderContext: {
    product: Product;
    plan: ProductPlan;
  } | null;
  setSelectedOrderContext: (context: { product: Product; plan: ProductPlan } | null) => void;
}

const initialHero: HeroContent = {
  badge: "🔥 Bangladesh's #1 VIP Platform",
  badgeBn: "🔥 বাংলাদেশের #১ ভিআইপি প্ল্যাটফর্ম",
  title: "Unlock Premium",
  titleBn: "প্রিমিয়াম",
  titleAccent: "Access",
  titleAccentBn: "অ্যাক্সেস",
  subtitle: "to the Internet",
  subtitleBn: "আনলক করুন",
  description: "Join thousands of smart Bangladeshis accessing premium tools, courses & methods at unbeatable prices.",
  descriptionBn: "হাজার হাজার স্মার্ট বাংলাদেশীদের সাথে যোগ দিন এবং সেরা দামে প্রিমিয়াম টুলস, কোর্স ও মেথড পান।",
  cta1: "Get VIP Access",
  cta1Bn: "ভিআইপি অ্যাক্সেস পান",
  cta2: "View Products",
  cta2Bn: "পণ্য দেখুন",
  backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop",
  announcement: "Welcome to Pro Access Hub!",
  announcementBn: "প্রো অ্যাক্সেস হাবে আপনাকে স্বাগতম!",
  showAnnouncement: true,
  stats: [
    { label: "Happy Users", labelBn: "সন্তুষ্ট ব্যবহারকারী", value: "10K+", valueBn: "১০কে+" },
    { label: "Premium Tools", labelBn: "প্রিমিয়াম টুলস", value: "500+", valueBn: "৫০০+" },
    { label: "Success Rate", labelBn: "সফলতার হার", value: "99%", valueBn: "৯৯+" },
  ]
};

const initialProducts: Product[] = [
  {
    id: 'method-hub',
    title: 'Method Hub - Lifetime',
    titleBn: 'মেথড হাব - লাইফটাইম',
    subtitle: 'All Types of Working Methods & Resources Hub',
    subtitleBn: 'সব ধরণের মেথড এবং রিসোর্স এর সমাহার',
    badge: 'Best Seller',
    badgeBn: 'বেস্ট সেলার',
    shortDescription: 'Get access to everything you need to start your digital journey.',
    shortDescriptionBn: 'আপনার ডিজিটাল যাত্রা শুরু করার জন্য প্রয়োজনীয় সবকিছুর অ্যাক্সেস পান।',
    buttonText: 'Get Lifetime Access',
    buttonTextBn: 'লাইফটাইম অ্যাক্সেস নিন',
    telegramLink: 'https://t.me/Agent_47VIP',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    visible: true,
    order: 1,
    plans: [
      { id: 'plan-1', name: 'Lifetime Access', nameBn: 'লাইফটাইম অ্যাক্সেস', priceTk: 1500, priceUsd: 13, duration: 'Lifetime' }
    ],
    bulletPoints: [
      { id: 'b1', text: 'All Types of Working Methods', textBn: 'সব ধরণের ওয়ার্কিং মেথড', visible: true, order: 1 },
      { id: 'b2', text: 'Payment Gateway Unlock Systems', textBn: 'পেমেন্ট গেটওয়ে আনলক সিস্টেম', visible: true, order: 2 },
      { id: 'b3', text: 'Ready-To-Sell High-Ticket Products', textBn: 'রেডি-টু-সেল হাই-টিকিট প্রোডাক্ট', visible: true, order: 3 },
      { id: 'b4', text: 'Step-By-Step Launch Guides', textBn: 'স্টেপ-বাই-স্টেপ লঞ্চ গাইড', visible: true, order: 4 },
      { id: 'b5', text: 'ChatGPT Plus & Go (Free)', textBn: 'চ্যাটজিপিটি প্লাস এবং গো (ফ্রি)', visible: true, order: 5 },
    ],
    features: [
      { id: 'f1', text: 'Gemini Pro + 5TB Drive 12M', textBn: 'জেমিনি প্রো + ৫টিবি ড্রাইভ ১২ মাস', visible: true, highlighted: false, order: 1 },
      { id: 'f2', text: 'Adobe Photoshop Pro – 1 Year', textBn: 'অ্যাডোব ফটোশপ প্রো - ১ বছর', visible: true, highlighted: false, order: 2 },
      { id: 'f3', text: 'Canva Pro – 3 Years', textBn: 'ক্যানভা প্রো - ৩ বছর', visible: true, highlighted: false, order: 3 },
    ]
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      isAdmin: false,
      setAdminStatus: (status) => set({ isAdmin: status }),

      hero: initialHero,
      updateHero: (hero) => set({ hero }),

      products: initialProducts,
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map((p) => (p.id === id ? product : p)),
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),

      faqs: [
        { id: '1', q: 'How to pay?', qBn: 'কিভাবে পেমেন্ট করবেন?', a: 'You can pay via bKash/Nagad.', aBn: 'বিকাশ বা নগদের মাধ্যমে পেমেন্ট করতে পারেন।', visible: true, order: 1 }
      ],
      setFAQs: (faqs) => set({ faqs }),
      addFAQ: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),
      updateFAQ: (id, faq) => set((state) => ({
        faqs: state.faqs.map((f) => (f.id === id ? faq : f)),
      })),
      deleteFAQ: (id) => set((state) => ({
        faqs: state.faqs.filter((f) => f.id !== id)
      })),

      reviews: [
        { id: '1', name: 'Rahat Ahmed', role: 'Digital Marketer', roleBn: 'ডিজিটাল মার্কেটার', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahat', rating: 5, review: 'Great service!', reviewBn: 'দুর্দান্ত সার্ভিস!', featured: true, visible: true, order: 1 }
      ],
      setReviews: (reviews) => set({ reviews }),
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
      updateReview: (id, review) => set((state) => ({
        reviews: state.reviews.map((r) => (r.id === id ? review : r)),
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id),
      })),

      countdown: {
        enabled: true,
        targetDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        title: "Price Increasing Soon!",
        titleBn: "মূল্য শীঘ্রই বাড়বে!",
        subtitle: "Get your access before the price goes up.",
        subtitleBn: "দাম বাড়ার আগেই আপনার অ্যাক্সেস নিন।",
      },
      updateCountdown: (countdown) => set({ countdown }),

      paymentSettings: {
        methodName: "bKash",
        number: "017XXXXXXXX",
        accountType: "Personal",
        accountTypeBn: "ব্যক্তিগত",
        instructionTitle: "Payment Instructions",
        instructionTitleBn: "পেমেন্ট নির্দেশাবলী",
        instructions: ["Send money to the number", "Message on Telegram"],
        instructionsBn: ["নম্বরে মানি সেন্ড করুন", "টেলিগ্রামে মেসেজ দিন"],
        qrCode: "",
        telegramLink: "https://t.me/Agent_47VIP",
        warningText: "Please send the exact amount.",
        warningTextBn: "অনুগ্রহ করে সঠিক পরিমাণ টাকা পাঠান।",
        currency: "TK",
      },
      updatePaymentSettings: (paymentSettings) => set({ paymentSettings }),

      settings: {
        siteName: "Pro Access VIP",
        siteNameBn: "প্রো অ্যাক্সেস ভিআইপি",
        telegramLink: "https://t.me/Agent_47VIP",
        telegramHandle: "@Agent_47VIP",
        floatingCTA: "Join VIP",
        floatingCTABn: "ভিআইপি যোগ দিন",
        logo: "PAV",
      },
      updateSettings: (settings) => set({ settings }),

      footer: {
        copyright: "© 2024 Pro Access Hub. All Rights Reserved.",
        copyrightBn: "© ২০২৪ প্রো অ্যাক্সেস হাব। সর্বস্বত্ব সংরক্ষিত।",
        links: [
          { label: "Terms", labelBn: "শর্তাবলী", url: "#" },
          { label: "Privacy", labelBn: "গোপনীয়তা", url: "#" },
        ],
      },
      updateFooter: (footer) => set({ footer }),

      pricingFeatures: [
        { id: '1', text: 'Premium Methods Access', textBn: 'প্রিমিয়াম মেথড এক্সেস' },
        { id: '2', text: 'Private Resource Database', textBn: 'প্রাইভেট রিসোর্স ডাটাবেস' },
        { id: '3', text: 'Lifetime Free Updates', textBn: 'লাইফটাইম ফ্রি আপডেট' },
        { id: '4', text: 'Priority Telegram Support', textBn: 'প্রায়োরিটি টেলিগ্রাম সাপোর্ট' },
      ],
      setPricingFeatures: (pricingFeatures) => set({ pricingFeatures }),

      globalFeatures: [
        { id: '1', title: 'Private Database', titleBn: 'প্রাইভেট ডাটাবেস', description: 'Access to 250,000+ premium resources exclusively for VIPs.', descriptionBn: '২৫০,০০০+ প্রিমিয়াম রিসোর্সে ভিআইপিদের জন্য বিশেষ অ্যাক্সেস।', icon: 'Database', visible: true, order: 1 },
        { id: '2', title: 'AI Agent Mastery', titleBn: 'এআই এজেন্ট মাস্টারি', description: 'Latest 2026 AI methods to automate your business.', descriptionBn: 'আপনার ব্যবসাকে অটোমেট করতে ২০২৬-এর লেটেস্ট এআই মেথড।', icon: 'Cpu', visible: true, order: 2 },
        { id: '3', title: 'Verified Quality', titleBn: 'ভেরিফাইড কোয়ালিটি', description: 'Every resource is tested and verified by our experts.', descriptionBn: 'প্রতিটি রিসোর্স আমাদের বিশেষজ্ঞদের দ্বারা পরীক্ষিত ও ভেরিফাইড।', icon: 'ShieldCheck', visible: true, order: 3 },
      ],
      setGlobalFeatures: (globalFeatures) => set({ globalFeatures }),

      navbar: {
        items: [
          { label: "Home", labelBn: "হোম", url: "/", order: 1 },
          { label: "Products", labelBn: "প্রোডাক্টস", url: "#products", order: 2 },
          { label: "Reviews", labelBn: "রিভিউ", url: "#reviews", order: 3 },
          { label: "FAQ", labelBn: "প্রশ্নোত্তর", url: "#faq", order: 4 },
        ]
      },
      updateNavbar: (navbar) => set({ navbar }),

      trustBadges: [
        { id: '1', text: "Secure Payment", textBn: "নিরাপদ পেমেন্ট", icon: "ShieldCheck", visible: true, order: 1 },
        { id: '2', text: "24/7 Support", textBn: "২৪/৭ সাপোর্ট", icon: "Headphones", visible: true, order: 2 },
        { id: '3', text: "Instant Access", textBn: "তাৎক্ষণিক অ্যাক্সেস", icon: "Zap", visible: true, order: 3 },
      ],
      setTrustBadges: (trustBadges) => set({ trustBadges }),

      pixelSettings: {
        enabled: false,
        pixelId: '',
      },
      updatePixelSettings: (pixelSettings) => set({ pixelSettings }),

      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrder: (id, order) => set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? order : o)),
      })),
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter((o) => (o.id !== id)),
      })),

      selectedOrderContext: null,
      setSelectedOrderContext: (context) => set({ selectedOrderContext: context }),
    }),
    {
      name: 'pro-access-hub-cms-v2',
    }
  )
);
