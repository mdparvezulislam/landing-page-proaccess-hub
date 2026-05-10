import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'bn';

export interface ProductPlan {
  id: string;
  nameEn: string;
  nameBn: string;
  priceTk: number;
  priceUsd?: number;
  duration: 'Monthly' | 'Yearly' | 'Lifetime';
}

export interface BulletPoint {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  order: number;
  icon?: string;
}

export interface Feature {
  id: string;
  textEn: string;
  textBn: string;
  visible: boolean;
  highlighted: boolean;
  order: number;
  includedInPlanIds?: string[]; // IDs of plans this feature is included in
}

export interface Product {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  badgeEn: string;
  badgeBn: string;
  shortDescriptionEn: string;
  shortDescriptionBn: string;
  buttonTextEn: string;
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
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
  visible: boolean;
  order: number;
}

export interface Review {
  id: string;
  name: string;
  roleEn: string;
  roleBn: string;
  image: string;
  rating: number;
  reviewEn: string;
  reviewBn: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface HeroContent {
  badgeEn: string;
  badgeBn: string;
  titleEn: string;
  titleBn: string;
  titleAccentEn: string;
  titleAccentBn: string;
  subtitleEn: string;
  subtitleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  cta1En: string;
  cta1Bn: string;
  cta2En: string;
  cta2Bn: string;
  stats: {
    labelEn: string;
    labelBn: string;
    valueEn: string;
    valueBn: string;
  }[];
}

export interface SiteSettings {
  siteNameEn: string;
  siteNameBn: string;
  telegramLink: string;
  telegramHandle: string;
  floatingCTAEn: string;
  floatingCTABn: string;
  announcementEn: string;
  announcementBn: string;
  showAnnouncement: boolean;
}

export interface CountdownSettings {
  enabled: boolean;
  targetDate: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  number: string;
  accountTypeEn: string;
  accountTypeBn: string;
  qrCode: string;
  color: string;
  enabled: boolean;
  order: number;
}

export interface PaymentSettings {
  instructionTitleEn: string;
  instructionTitleBn: string;
  instructionsEn: string[];
  instructionsBn: string[];
  warningTextEn: string;
  warningTextBn: string;
  methods: PaymentMethod[];
}

export interface FooterSettings {
  copyrightEn: string;
  copyrightBn: string;
  links: { labelEn: string; labelBn: string; url: string }[];
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

export interface GlobalFeature {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  visible: boolean;
  order: number;
}

export interface TrustBadge {
  id: string;
  textEn: string;
  textBn: string;
  icon: string;
  visible: boolean;
  order: number;
}

export interface NavbarItem {
  id: string;
  labelEn: string;
  labelBn: string;
  url: string;
  order: number;
}

export interface NavbarSettings {
  items: NavbarItem[];
}

export interface FeaturesSectionSettings {
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  isAdmin: boolean;
  setAdminStatus: (status: boolean) => void;

  hero: HeroContent;
  updateHero: (hero: HeroContent) => void;

  featuresSection: FeaturesSectionSettings;
  updateFeaturesSection: (settings: FeaturesSectionSettings) => void;

  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;

  navbar: NavbarSettings;
  updateNavbar: (navbar: NavbarSettings) => void;

  globalFeatures: GlobalFeature[];
  setGlobalFeatures: (features: GlobalFeature[]) => void;
  addGlobalFeature: (feature: GlobalFeature) => void;
  updateGlobalFeature: (id: string, feature: GlobalFeature) => void;
  deleteGlobalFeature: (id: string) => void;

  trustBadges: TrustBadge[];
  setTrustBadges: (badges: TrustBadge[]) => void;
  addTrustBadge: (badge: TrustBadge) => void;
  updateTrustBadge: (id: string, badge: TrustBadge) => void;
  deleteTrustBadge: (id: string) => void;

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

  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  deleteOrder: (id: string) => void;

  // Runtime state
  selectedOrderContext: {
    product: Product;
    plan: ProductPlan;
  } | null;
  setSelectedOrderContext: (context: { product: Product; plan: ProductPlan } | null) => void;
}

const initialHero: HeroContent = {
  badgeEn: "🔥 Bangladesh's #1 VIP Platform",
  badgeBn: "🔥 বাংলাদেশের #১ ভিআইপি প্ল্যাটফর্ম",
  titleEn: "Unlock Premium",
  titleBn: "প্রিমিয়াম",
  titleAccentEn: "Access",
  titleAccentBn: "অ্যাক্সেস",
  subtitleEn: "to the Internet",
  subtitleBn: "আনলক করুন",
  descriptionEn: "Join thousands of smart Bangladeshis accessing premium tools, courses & methods at unbeatable prices.",
  descriptionBn: "হাজার হাজার স্মার্ট বাংলাদেশীদের সাথে যোগ দিন এবং সেরা দামে প্রিমিয়াম টুলস, কোর্স ও মেথড পান।",
  cta1En: "Get VIP Access",
  cta1Bn: "ভিআইপি অ্যাক্সেস পান",
  cta2En: "View Products",
  cta2Bn: "পণ্য দেখুন",
  stats: [
    { labelEn: "Happy Users", labelBn: "সন্তুষ্ট ব্যবহারকারী", valueEn: "10K+", valueBn: "১০কে+" },
    { labelEn: "Premium Tools", labelBn: "প্রিমিয়াম টুলস", valueEn: "500+", valueBn: "৫০০+" },
    { labelEn: "Success Rate", labelBn: "সফলতার হার", valueEn: "99%", valueBn: "৯৯%" },
  ]
};

const initialProducts: Product[] = [
  {
    id: 'method-hub',
    titleEn: 'Method Hub - Lifetime',
    titleBn: 'মেথড হাব - লাইফটাইম',
    subtitleEn: 'All Types of Working Methods & Resources Hub',
    subtitleBn: 'সব ধরণের মেথড এবং রিসোর্স এর সমাহার',
    badgeEn: 'Best Seller',
    badgeBn: 'বেস্ট সেলার',
    shortDescriptionEn: 'Get access to everything you need to start your digital journey.',
    shortDescriptionBn: 'আপনার ডিজিটাল যাত্রা শুরু করার জন্য প্রয়োজনীয় সবকিছুর অ্যাক্সেস পান।',
    buttonTextEn: 'Get Lifetime Access',
    buttonTextBn: 'লাইফটাইম অ্যাক্সেস নিন',
    telegramLink: 'https://t.me/Agent_47VIP',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    visible: true,
    order: 1,
    plans: [
      { id: 'p1', nameEn: 'Monthly Access', nameBn: 'মাসিক অ্যাক্সেস', priceTk: 699, duration: 'Monthly' },
      { id: 'p2', nameEn: 'Yearly Access', nameBn: 'বার্ষিক অ্যাক্সেস', priceTk: 5000, duration: 'Yearly' },
      { id: 'p3', nameEn: 'Lifetime Access', nameBn: 'লাইফটাইম অ্যাক্সেস', priceTk: 1500, duration: 'Lifetime' }
    ],
    bulletPoints: [
      { id: 'b1', textEn: 'All Types of Working Methods', textBn: 'সব ধরণের ওয়ার্কিং মেথড', visible: true, order: 1 },
      { id: 'b2', textEn: 'Payment Gateway Unlock Systems', textBn: 'পেমেন্ট গেটওয়ে আনলক সিস্টেম', visible: true, order: 2 },
      { id: 'b3', textEn: 'Ready-To-Sell High-Ticket Products', textBn: 'রেডি-টু-সেল হাই-টিকিট প্রোডাক্ট', visible: true, order: 3 },
      { id: 'b4', textEn: 'Step-By-Step Launch Guides', textBn: 'স্টেপ-বাই-স্টেপ লঞ্চ গাইড', visible: true, order: 4 },
      { id: 'b5', textEn: 'ChatGPT Plus & Go (Free)', textBn: 'চ্যাটজিপিটি প্লাস এবং গো (ফ্রি)', visible: true, order: 5 },
    ],
    features: [
      { id: 'f1', textEn: 'Gemini Pro + 5TB Drive 12M', textBn: 'জেমিনি প্রো + ৫টিবি ড্রাইভ ১২ মাস', visible: true, highlighted: false, order: 1 },
      { id: 'f2', textEn: 'Adobe Photoshop Pro – 1 Year', textBn: 'অ্যাডোব ফটোশপ প্রো - ১ বছর', visible: true, highlighted: false, order: 2 },
      { id: 'f3', textEn: 'Canva Pro – 3 Years', textBn: 'ক্যানভা প্রো - ৩ বছর', visible: true, highlighted: false, order: 3 },
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

      featuresSection: {
        titleEn: 'Why Choose Pro Access Hub?',
        titleBn: 'কেন প্রো এক্সেস হাব বেছে নিবেন?',
        descriptionEn: 'We provide the highest quality resources and secret methods to help you succeed in the digital world.',
        descriptionBn: 'আমরা আপনাকে ডিজিটাল বিশ্বে সফল হতে সাহায্য করার জন্য সর্বোচ্চ মানের রিসোর্স এবং সিক্রেট মেথড প্রদান করি।',
      },
      updateFeaturesSection: (featuresSection) => set({ featuresSection }),

      products: initialProducts,
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map((p) => (p.id === id ? product : p)),
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),

      navbar: {
        items: [
          { id: '1', labelEn: 'Products', labelBn: 'পণ্য', url: '#products', order: 1 },
          { id: '2', labelEn: 'Pricing', labelBn: 'প্রাইসিং', url: '#pricing', order: 2 },
          { id: '3', labelEn: 'FAQ', labelBn: 'প্রশ্নোত্তর', url: '#faq', order: 3 },
          { id: '4', labelEn: 'Reviews', labelBn: 'রিভিউ', url: '#reviews', order: 4 },
        ]
      },
      updateNavbar: (navbar) => set({ navbar }),

      globalFeatures: [
        { id: '1', titleEn: 'Secret Methods', titleBn: 'সিক্রেট মেথড', descriptionEn: 'Get access to 100% working secret methods.', descriptionBn: '১০০% কার্যকর সিক্রেট মেথডের অ্যাক্সেস পান।', icon: 'Zap', visible: true, order: 1 },
        { id: '2', titleEn: 'Premium Support', titleBn: 'প্রিমিয়াম সাপোর্ট', descriptionEn: '24/7 priority support on Telegram.', descriptionBn: 'টেলিগ্রামে ২৪/৭ প্রায়োরিটি সাপোর্ট।', icon: 'Headset', visible: true, order: 2 },
      ],
      setGlobalFeatures: (globalFeatures) => set({ globalFeatures }),
      addGlobalFeature: (feature) => set((state) => ({ globalFeatures: [...state.globalFeatures, feature] })),
      updateGlobalFeature: (id, feature) => set((state) => ({
        globalFeatures: state.globalFeatures.map((f) => (f.id === id ? feature : f)),
      })),
      deleteGlobalFeature: (id) => set((state) => ({
        globalFeatures: state.globalFeatures.filter((f) => f.id !== id),
      })),

      trustBadges: [
        { id: '1', textEn: 'Verified Vendor', textBn: 'ভেরিফাইড ভেন্ডর', icon: 'ShieldCheck', visible: true, order: 1 },
        { id: '2', textEn: 'Safe Payment', textBn: 'নিরাপদ পেমেন্ট', icon: 'Lock', visible: true, order: 2 },
        { id: '3', textEn: '24/7 Support', textBn: '২৪/৭ সাপোর্ট', icon: 'Headset', visible: true, order: 3 },
      ],
      setTrustBadges: (trustBadges) => set({ trustBadges }),
      addTrustBadge: (badge) => set((state) => ({ trustBadges: [...state.trustBadges, badge] })),
      updateTrustBadge: (id, badge) => set((state) => ({
        trustBadges: state.trustBadges.map((b) => (b.id === id ? badge : b)),
      })),
      deleteTrustBadge: (id) => set((state) => ({
        trustBadges: state.trustBadges.filter((b) => b.id !== id),
      })),

      faqs: [
        { id: '1', qEn: 'How to pay?', qBn: 'কিভাবে পেমেন্ট করবেন?', aEn: 'You can pay via bKash/Nagad.', aBn: 'বিকাশ বা নগদের মাধ্যমে পেমেন্ট করতে পারেন।', visible: true, order: 1 }
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
        { id: '1', name: 'Rahat Ahmed', roleEn: 'Digital Marketer', roleBn: 'ডিজিটাল মার্কেটার', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahat', rating: 5, reviewEn: 'Great service!', reviewBn: 'দুর্দান্ত সার্ভিস!', featured: true, visible: true, order: 1 }
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
        titleEn: "Price Increasing Soon!",
        titleBn: "মূল্য শীঘ্রই বাড়বে!",
        subtitleEn: "Get your access before the price goes up.",
        subtitleBn: "দাম বাড়ার আগেই আপনার অ্যাক্সেস নিন।",
      },
      updateCountdown: (countdown) => set({ countdown }),

      paymentSettings: {
        instructionTitleEn: "Payment Instructions",
        instructionTitleBn: "পেমেন্ট নির্দেশাবলী",
        instructionsEn: ["Send money to the number", "Message on Telegram"],
        instructionsBn: ["নম্বরে মানি সেন্ড করুন", "টেলিগ্রামে মেসেজ দিন"],
        warningTextEn: "Please send the exact amount.",
        warningTextBn: "অনুগ্রহ করে সঠিক পরিমাণ টাকা পাঠান।",
        methods: [
          { id: 'bkash', name: 'bKash', number: '017XXXXXXXX', accountTypeEn: 'Personal', accountTypeBn: 'পার্সোনাল', qrCode: '', color: '#D12053', enabled: true, order: 1 },
          { id: 'nagad', name: 'Nagad', number: '018XXXXXXXX', accountTypeEn: 'Personal', accountTypeBn: 'পার্সোনাল', qrCode: '', color: '#F7941D', enabled: true, order: 2 }
        ]
      },
      updatePaymentSettings: (paymentSettings) => set({ paymentSettings }),

      settings: {
        siteNameEn: "Pro Access VIP",
        siteNameBn: "প্রো অ্যাক্সেস ভিআইপি",
        telegramLink: "https://t.me/Agent_47VIP",
        telegramHandle: "@Agent_47VIP",
        floatingCTAEn: "Join VIP",
        floatingCTABn: "ভিআইপি যোগ দিন",
        announcementEn: "Welcome to Pro Access Hub!",
        announcementBn: "প্রো অ্যাক্সেস হাবে আপনাকে স্বাগতম!",
        showAnnouncement: true,
      },
      updateSettings: (settings) => set({ settings }),

      footer: {
        copyrightEn: "© 2024 Pro Access Hub. All Rights Reserved.",
        copyrightBn: "© ২০২৪ প্রো অ্যাক্সেস হাব। সর্বস্বত্ব সংরক্ষিত।",
        links: [
          { labelEn: "Terms", labelBn: "শর্তাবলী", url: "#" },
          { labelEn: "Privacy", labelBn: "গোপনীয়তা", url: "#" },
        ],
      },
      updateFooter: (footer) => set({ footer }),

      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      })),
      deleteOrder: (id) => set((state) => ({
        orders: state.orders.filter((o) => o.id !== id),
      })),

      selectedOrderContext: null,
      setSelectedOrderContext: (context) => set({ selectedOrderContext: context }),
    }),
    {
      name: 'pro-access-hub-cms-v2',
    }
  )
);
