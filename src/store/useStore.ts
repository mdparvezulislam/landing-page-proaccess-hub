import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

export interface ProductPlan {
  name: string;
  priceTk: number;
  priceUsd?: number;
  duration: 'Monthly' | 'Yearly' | 'Lifetime';
}

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  plans: ProductPlan[];
  featuresEn: string[];
  featuresBn: string[];
}

export interface FAQ {
  id: string;
  q: string;
  qBn: string;
  a: string;
  aBn: string;
}

export interface Countdown {
  targetDate: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
}

export interface SiteSettings {
  telegramLink: string;
  telegramHandle: string;
  siteName: string;
  siteNameBn: string;
  floatingCTA: string;
  floatingCTABn: string;
}

export interface HeroContent {
  badge: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  description: string;
  cta1: string;
  cta2: string;
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

export interface Review {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  review: string;
  featured: boolean;
}

export interface PaymentSettings {
  methodName: string;
  number: string;
  accountType: string;
  instructionTitle: string;
  instructions: string[];
  qrCode: string;
  telegramLink: string;
  warningText: string;
  currency: string;
}

export interface PixelSettings {
  pixelId: string;
  enabled: boolean;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdmin: boolean;
  setAdminStatus: (status: boolean) => void;
  
  products: Product[];
  updateProduct: (id: string, updatedProduct: Product) => void;
  
  hero: { en: HeroContent; bn: HeroContent };
  updateHero: (lang: Language, content: HeroContent) => void;

  faqs: FAQ[];
  updateFAQ: (id: string, updatedFAQ: FAQ) => void;
  addFAQ: (faq: FAQ) => void;
  deleteFAQ: (id: string) => void;

  countdown: Countdown;
  updateCountdown: (countdown: Countdown) => void;

  settings: SiteSettings;
  updateSettings: (settings: SiteSettings) => void;

  // Features from previous turn
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;
  
  reviews: Review[];
  addReview: (review: Review) => void;
  updateReview: (id: string, updatedReview: Review) => void;
  deleteReview: (id: string) => void;
  
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  
  pixelSettings: PixelSettings;
  updatePixelSettings: (settings: PixelSettings) => void;

  selectedOrderContext: {
    product: Product;
    plan: ProductPlan;
  } | null;
  setSelectedOrderContext: (context: { product: Product; plan: ProductPlan } | null) => void;
}

const initialHero = {
  en: {
    badge: "🔥 Bangladesh's #1 VIP Platform",
    title: "Unlock Premium",
    titleAccent: "Access",
    subtitle: "to the Internet",
    description: "Join thousands of smart Bangladeshis accessing premium tools, courses & methods at unbeatable prices.",
    cta1: "Get VIP Access",
    cta2: "View Products",
  },
  bn: {
    badge: "🔥 বাংলাদেশের #১ ভিআইপি প্ল্যাটফর্ম",
    title: "প্রিমিয়াম",
    titleAccent: "অ্যাক্সেস",
    subtitle: "আনলক করুন",
    description: "হাজার হাজার স্মার্ট বাংলাদেশীদের সাথে যোগ দিন এবং সেরা দামে প্রিমিয়াম টুলস, কোর্স ও মেথড পান।",
    cta1: "ভিআইপি অ্যাক্সেস পান",
    cta2: "পণ্য দেখুন",
  }
};

const initialFAQs: FAQ[] = [
  {
    id: '1',
    q: "How do I get access after payment?",
    qBn: "পেমেন্টের পরে কীভাবে অ্যাক্সেস পাব?",
    a: "After payment, message @Agent_47VIP on Telegram with your payment screenshot. You'll get access within minutes.",
    aBn: "পেমেন্টের পরে, টেলিগ্রামে @Agent_47VIP-কে পেমেন্টের স্ক্রিনশট সহ মেসেজ করুন। মিনিটের মধ্যে অ্যাক্সেস পাবেন।"
  },
  {
    id: '2',
    q: "What payment methods are accepted?",
    qBn: "কোন পেমেন্ট পদ্ধতি গ্রহণযোগ্য?",
    a: "We accept bKash, Nagad, Rocket, USDT, and bank transfer. Contact us for more options.",
    aBn: "আমরা বিকাশ, নগদ, রকেট, USDT এবং ব্যাংক ট্রান্সফার গ্রহণ করি। আরও বিকল্পের জন্য আমাদের সাথে যোগাযোগ করুন।"
  }
];

const initialProducts: Product[] = [
  {
    id: 'method-hub',
    nameEn: 'Method Hub - Lifetime',
    nameBn: 'মেথড হাব - লাইফটাইম',
    descriptionEn: 'All Types of Working Methods & Resources Hub',
    descriptionBn: 'সব ধরণের মেথড এবং রিসোর্স এর সমাহার',
    plans: [
      { name: 'Lifetime Access', priceTk: 1500, priceUsd: 13, duration: 'Lifetime' }
    ],
    featuresEn: [
      'All Types of Working Methods',
      'Payment Gateway Unlock Systems',
      'Ready-To-Sell High-Ticket Products',
      'Step-By-Step Launch Guides',
      'ChatGPT Plus & Go (Free)',
      'Gemini Pro + 5TB Drive 12M',
      'Adobe Photoshop Pro – 1 Year',
      'Canva Pro – 3 Years',
      'Youtube Premium Method',
      'Stripe & Shopify Payment Methods',
      'TikTok Agency Method + $1,390 Method',
      'Unlimited RDP Method',
      'Premium Digital Product Suppliers (22+)'
    ],
    featuresBn: [
      'সব ধরণের ওয়ার্কিং মেথড',
      'পেমেন্ট গেটওয়ে আনলক সিস্টেম',
      'রেডি-টু-সেল হাই-টিকিট প্রোডাক্ট',
      'স্টেপ-বাই-স্টেপ লঞ্চ গাইড',
      'চ্যাটজিপিটি প্লাস এবং গো (ফ্রি)',
      'জেমিনি প্রো + ৫টিবি ড্রাইভ ১২ মাস',
      'অ্যাডোব ফটোশপ প্রো - ১ বছর',
      'ক্যানভা প্রো - ৩ বছর',
      'ইউটিউব প্রিমিয়াম মেথড',
      'স্ট্রাইপ এবং শপিফাই পেমেন্ট মেথড',
      'টিকটক এজেন্সি মেথড + $১,৩৯০ মেথড',
      'আনলিমিটেড RDP মেথড',
      'প্রিমিয়াম ডিজিটাল প্রোডাক্ট সাপ্লায়ার (২২+)'
    ]
  },
  {
    id: 'vip-batch-2',
    nameEn: 'Pro Access VIP Batch 2',
    nameBn: 'প্রো এক্সেস ভিআইপি ব্যাচ ২',
    descriptionEn: 'The Vault (Worth €250,000+ Resources)',
    descriptionBn: 'দা ভল্ট (২৫০,০০০ ইউরো মূল্যের রিসোর্স)',
    plans: [
      { name: 'Monthly Access', priceTk: 699, duration: 'Monthly' },
      { name: 'Yearly Access', priceTk: 5000, duration: 'Yearly' },
      { name: 'Lifetime Access', priceTk: 15000, duration: 'Lifetime' }
    ],
    featuresEn: [
      '100K+ Premium Courses from 100+ Platforms',
      '10MS, sayeedfahad, anantvijaysoni All Courses',
      'Advance 2D Animation Mentorship',
      'Video Editing Live Batch 03',
      'Shopify International Dropshipping',
      'International Client Hunting Secret Formula',
      'Searcher Bot Access (Unlimited Search)',
      'Private Database for VIP Members',
      'High Hit Rate Methods',
      '2026 AI Agent Mastery',
      'TikTok Automation & YouTube Masterclass'
    ],
    featuresBn: [
      '১০০+ প্ল্যাটফর্ম থেকে ১ লক্ষ+ প্রিমিয়াম কোর্স',
      '১০এমএস, সাইদ ফাহাদ, অনন্ত বিজয় সোনী সব কোর্স',
      'অ্যাডভান্স ২ডি অ্যানিমেশন মেন্টরশিপ',
      'ভিডিও এডিটিং লাইভ ব্যাচ ০৩',
      'শপিফাই ইন্টারন্যাশনাল ড্রপশিপিং কোর্স',
      'ক্লায়েন্ট হান্টিং সিক্রেট ফর্মুলা',
      'সার্চার বট এক্সেস (আনলিমিটেড সার্চ)',
      'ভিআইপি মেম্বারদের জন্য প্রাইভেট ডাটাবেস',
      'হাই হিট রেট মেথডস',
      '২০২৬ এআই এজেন্ট মাস্টারি',
      'টিকটক অটোমেশন এবং ইউটিউব মাস্টারক্লাস'
    ]
  }
];

const initialPaymentSettings: PaymentSettings = {
  methodName: "bKash",
  number: "017XXXXXXXX",
  accountType: "Personal",
  instructionTitle: "Payment Instructions",
  instructions: [
    "Send money to the number",
    "Use your Order ID as reference",
    "Take screenshot after payment",
    "Click confirm order button",
    "Chat with admin after payment"
  ],
  qrCode: "",
  telegramLink: "https://t.me/Agent_47VIP",
  warningText: "Please send exact amount",
  currency: "TK"
};

const initialReviews: Review[] = [
  {
    id: '1',
    name: 'Rahat Ahmed',
    role: 'Digital Marketer',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahat',
    rating: 5,
    review: 'The Pro Access VIP hub is a game changer for me. The methods are actually working and the course collection is massive!',
    featured: true
  },
  {
    id: '2',
    name: 'Sifat Islam',
    role: 'Student',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sifat',
    rating: 5,
    review: 'Best investment I have ever made. The support from @Agent_47VIP is top notch. Highly recommended!',
    featured: true
  }
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      isAdmin: false,
      setAdminStatus: (status) => set({ isAdmin: status }),
      products: initialProducts,
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map(p => p.id === id ? updatedProduct : p)
      })),

      hero: initialHero,
      updateHero: (lang, content) => set((state) => ({
        hero: { ...state.hero, [lang]: content }
      })),

      faqs: initialFAQs,
      updateFAQ: (id, updatedFAQ) => set((state) => ({
        faqs: state.faqs.map(f => f.id === id ? updatedFAQ : f)
      })),
      addFAQ: (faq) => set((state) => ({ faqs: [...state.faqs, faq] })),
      deleteFAQ: (id) => set((state) => ({ faqs: state.faqs.filter(f => f.id !== id) })),

      countdown: {
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        title: "Price Increasing Soon!",
        titleBn: "মূল্য শীঘ্রই বাড়বে!",
        subtitle: "Lock in current price before it's too late",
        subtitleBn: "দেরি হওয়ার আগেই বর্তমান মূল্য নিশ্চিত করুন",
      },
      updateCountdown: (countdown) => set({ countdown }),

      settings: {
        telegramLink: "https://t.me/Agent_47VIP",
        telegramHandle: "@Agent_47VIP",
        siteName: "Pro Access VIP",
        siteNameBn: "প্রো অ্যাক্সেস ভিআইপি",
        floatingCTA: "Join VIP",
        floatingCTABn: "ভিআইপি যোগ দিন",
      },
      updateSettings: (settings) => set({ settings }),

      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id)
      })),

      reviews: initialReviews,
      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      updateReview: (id, updatedReview) => set((state) => ({
        reviews: state.reviews.map(r => r.id === id ? updatedReview : r)
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter(r => r.id !== id)
      })),

      paymentSettings: initialPaymentSettings,
      updatePaymentSettings: (settings) => set({ paymentSettings: settings }),

      pixelSettings: { pixelId: '', enabled: false },
      updatePixelSettings: (settings) => set({ pixelSettings: settings }),

      selectedOrderContext: null,
      setSelectedOrderContext: (context) => set({ selectedOrderContext: context }),
    }),
    {
      name: 'vip-hub-storage-v3',
    }
  )
);
