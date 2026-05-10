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
  title: string;
  titleBn: string;
  visible: boolean;
  order: number;
  plans: {
    monthly: boolean;
    yearly: boolean;
    lifetime: boolean;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  number: string;
  accountName: string;
  qrCode: string;
  instructions: string;
  enabled: boolean;
  icon: string;
  color: string;
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
  features: { id: string; text: string; textBn: string; available: boolean; visible: boolean; highlighted: boolean; order: number }[];
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
  adminPassword?: string;
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

  pricingFeatures: Feature[];
  setPricingFeatures: (features: Feature[]) => void;

  paymentMethods: PaymentMethod[];
  setPaymentMethods: (methods: PaymentMethod[]) => void;

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
  title: "Join the Elite",
  titleBn: "এলিট কমিউনিটিতে",
  titleAccent: "VIP Hub",
  titleAccentBn: "যোগ দিন",
  subtitle: "Access Tomorrow's Internet Today",
  subtitleBn: "আগামীর প্রযুক্তি আজই পান",
  description: "Get lifetime access to premium methods, verified resources, and exclusive tools used by the top 1% of digital entrepreneurs.",
  descriptionBn: "সেরা ১% ডিজিটাল উদ্যোক্তাদের ব্যবহৃত প্রিমিয়াম মেথড, ভেরিফাইড রিসোর্স এবং এক্সক্লুসিভ টুলসের লাইফটাইম অ্যাক্সেস পান।",
  cta1: "Get VIP Access Now",
  cta1Bn: "ভিআইপি অ্যাক্সেস নিন",
  cta2: "Compare Plans",
  cta2Bn: "প্ল্যান তুলনা করুন",
  backgroundImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop",
  announcement: "Limited Time: Lifetime Membership prices increasing in 48 hours!",
  announcementBn: "সীমিত সময়: লাইফটাইম মেম্বারশিপের দাম ৪৮ ঘণ্টার মধ্যে বাড়ছে!",
  showAnnouncement: true,
  stats: [
    { label: "Active Members", labelBn: "সক্রিয় সদস্য", value: "12,450+", valueBn: "১২,৪৫০+" },
    { label: "Verified Resources", labelBn: "ভেরিফাইড রিসোর্স", value: "250K+", valueBn: "২৫০কে+" },
    { label: "Daily Methods", labelBn: "ডেইলি মেথড", value: "15+", valueBn: "১৫+" },
    { label: "Success Rate", labelBn: "সাফল্যের হার", value: "99.8%", valueBn: "৯৯.৮%" },
  ]
};

const initialProducts: Product[] = [
  {
    id: 'vip-membership',
    title: 'VIP Master Membership',
    titleBn: 'ভিআইপি মাস্টার মেম্বারশিপ',
    subtitle: 'Everything you need to scale',
    subtitleBn: 'স্কেল করার জন্য যা প্রয়োজন',
    badge: 'High Conversion',
    badgeBn: 'হাই কনভার্সন',
    shortDescription: 'The ultimate vault for digital nomads and smart hustlers in Bangladesh.',
    shortDescriptionBn: 'বাংলাদেশের ডিজিটাল উদ্যোক্তা এবং স্মার্ট পেশাদারদের জন্য সেরা ভল্ট।',
    buttonText: 'Join VIP Community',
    buttonTextBn: 'ভিআইপি কমিউনিটিতে যোগ দিন',
    telegramLink: 'https://t.me/Agent_47VIP',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
    visible: true,
    order: 1,
    plans: [
      { id: 'p1', name: 'Standard Monthly', nameBn: 'মান্থলি স্ট্যান্ডার্ড', priceTk: 499, priceUsd: 5, duration: 'Monthly' },
      { id: 'p2', name: 'Elite Yearly', nameBn: 'ইয়ারলি এলিট', priceTk: 2499, priceUsd: 22, duration: 'Yearly' },
      { id: 'p3', name: 'Legendary Lifetime', nameBn: 'লাইফটাইম লেজেন্ডারি', priceTk: 4999, priceUsd: 45, duration: 'Lifetime' }
    ],
    bulletPoints: [
      { id: 'b1', text: 'Daily Updated Working Methods', textBn: 'প্রতিদিন আপডেট হওয়া মেথড', visible: true, order: 1 },
      { id: 'b2', text: 'Private Telegram VIP Group', textBn: 'প্রাইভেট টেলিগ্রাম ভিআইপি গ্রুপ', visible: true, order: 2 },
      { id: 'b3', text: 'Exclusive Digital Asset Vault', textBn: 'এক্সক্লুসিভ ডিজিটাল অ্যাসেট ভল্ট', visible: true, order: 3 },
      { id: 'b4', text: 'Direct 1-on-1 Support', textBn: 'সরাসরি ১-অন-১ সাপোর্ট', visible: true, order: 4 },
    ],
    features: []
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
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      updateProduct: (id, product) => set((state) => ({
        products: state.products.map((p) => (p.id === id ? product : p)),
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      })),

      faqs: [
        { id: '1', q: 'How do I get access after payment?', qBn: 'পেমেন্টের পর এক্সেস পাবো কি?', a: 'You will get instant access credentials automatically after verification.', aBn: 'ভেরিফিকেশনের পর আপনি স্বয়ংক্রিয়ভাবে এক্সেস পেয়ে যাবেন।', visible: true, order: 1 }
      ],
      setFAQs: (faqs) => set({ faqs }),
      addFAQ: (faq) => set((state) => ({ faqs: [faq, ...state.faqs] })),
      updateFAQ: (id, faq) => set((state) => ({
        faqs: state.faqs.map((f) => (f.id === id ? faq : f)),
      })),
      deleteFAQ: (id) => set((state) => ({
        faqs: state.faqs.filter((f) => f.id !== id)
      })),

      reviews: [
        { id: '1', name: 'Ahmed Shuvo', role: 'Full Stack Developer', roleBn: 'ডেভেলপার', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed', rating: 5, review: 'The best investment I made this year. The methods are actually working!', reviewBn: 'এ বছরের সেরা ইনভেস্টমেন্ট। মেথডগুলো সত্যিই কাজ করে!', featured: true, visible: true, order: 1 },
        { id: '2', name: 'Sabbir Hossain', role: 'Freelancer', roleBn: 'ফ্রিল্যান্সার', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sabbir', rating: 5, review: 'Unlimited resources and a great community. Highly recommended.', reviewBn: 'অফুরন্ত রিসোর্স এবং চমৎকার কমিউনিটি। হাইলি রিকমেন্ডেড।', featured: true, visible: true, order: 2 }
      ],
      setReviews: (reviews) => set({ reviews }),
      addReview: (review) => set((state) => ({ reviews: [review, ...state.reviews] })),
      updateReview: (id, review) => set((state) => ({
        reviews: state.reviews.map((r) => (r.id === id ? review : r)),
      })),
      deleteReview: (id) => set((state) => ({
        reviews: state.reviews.filter((r) => r.id !== id),
      })),

      countdown: {
        enabled: true,
        targetDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        title: "Price Hike Incoming!",
        titleBn: "মূল্য বাড়ছে!",
        subtitle: "Join now to lock in your lifetime access before the price doubles.",
        subtitleBn: "দাম দ্বিগুণ হওয়ার আগেই আপনার লাইফটাইম অ্যাক্সেস নিশ্চিত করুন।",
      },
      updateCountdown: (countdown) => set({ countdown }),

      paymentSettings: {
        methodName: "bKash",
        number: "017XXXXXXXX",
        accountType: "Personal",
        accountTypeBn: "ব্যক্তিগত",
        instructionTitle: "Payment Instructions",
        instructionTitleBn: "পেমেন্ট নির্দেশাবলী",
        instructions: ["Send money to the number", "Copy TrxID", "Submit verification form"],
        instructionsBn: ["নম্বরে সেন্ড মানি করুন", "ট্রানজেকশন আইডি কপি করুন", "ভেরিফিকেশন ফর্ম জমা দিন"],
        qrCode: "",
        telegramLink: "https://t.me/Agent_47VIP",
        warningText: "Please ensure the amount is correct to avoid activation delays.",
        warningTextBn: "অ্যাক্টিভেশনে বিলম্ব এড়াতে সঠিক পরিমাণ টাকা পাঠিয়েছেন তা নিশ্চিত করুন।",
        currency: "TK",
      },
      updatePaymentSettings: (paymentSettings) => set({ paymentSettings }),

      paymentMethods: [
        {
          id: 'bkash',
          name: "bKash",
          type: "Personal",
          number: "017XXXXXXXX",
          accountName: "VIP Hub Admin",
          qrCode: "",
          instructions: "1. Dial *247# or open bKash app\n2. Select Send Money\n3. Enter the number above\n4. Enter the plan price\n5. Complete payment",
          enabled: true,
          icon: "bkash",
          color: "#D12053",
          order: 1
        },
        {
          id: 'nagad',
          name: "Nagad",
          type: "Personal",
          number: "018XXXXXXXX",
          accountName: "VIP Hub Admin",
          qrCode: "",
          instructions: "1. Dial *167# or open Nagad app\n2. Select Send Money\n3. Enter the number above\n4. Enter the plan price\n5. Complete payment",
          enabled: true,
          icon: "nagad",
          color: "#F7941D",
          order: 2
        }
      ],
      setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
      settings: {
        siteName: "VIP Membership",
        siteNameBn: "ভিআইপি মেম্বারশিপ",
        telegramLink: "https://t.me/Agent_47VIP",
        telegramHandle: "@Agent_47VIP",
        floatingCTA: "Join VIP",
        floatingCTABn: "ভিআইপি জয়েন করুন",
        logo: "VIP",
        adminPassword: "pro_access_23",
      },
      updateSettings: (settings) => set({ settings }),

      footer: {
        copyright: "© 2024 Pro Access VIP Hub. Crafted for Digital Nomads.",
        copyrightBn: "© ২০২৪ প্রো অ্যাক্সেস ভিআইপি হাব। ডিজিটাল উদ্যোক্তাদের জন্য তৈরি।",
        links: [
          { label: "Methods", labelBn: "মেথড", url: "#products" },
          { label: "Pricing", labelBn: "প্রাইসিং", url: "#pricing" },
          { label: "Reviews", labelBn: "রিভিউ", url: "#reviews" },
        ],
      },
      updateFooter: (footer) => set({ footer }),

      pricingFeatures: [
        { id: 'f1', title: 'Private Vault Access', titleBn: 'প্রাইভেট ভল্ট এক্সেস', visible: true, order: 1, plans: { monthly: true, yearly: true, lifetime: true } },
        { id: 'f2', title: 'Daily Method Updates', titleBn: 'ডেইলি মেথড আপডেট', visible: true, order: 2, plans: { monthly: true, yearly: true, lifetime: true } },
        { id: 'f3', title: 'VIP Community Access', titleBn: 'ভিআইপি কমিউনিটি এক্সেস', visible: true, order: 3, plans: { monthly: false, yearly: true, lifetime: true } },
        { id: 'f4', title: '1-on-1 Strategy Calls', titleBn: '১-অন-১ স্ট্র্যাটেজি কল', visible: true, order: 4, plans: { monthly: false, yearly: false, lifetime: true } },
        { id: 'f5', title: 'Premium Resource Packs', titleBn: 'প্রিমিয়াম রিসোর্স প্যাক', visible: true, order: 5, plans: { monthly: false, yearly: true, lifetime: true } },
        { id: 'f6', title: 'Lifetime Free Updates', titleBn: 'লাইফটাইম ফ্রি আপডেট', visible: true, order: 6, plans: { monthly: false, yearly: false, lifetime: true } },
      ],
      setPricingFeatures: (pricingFeatures) => set({ pricingFeatures }),

      globalFeatures: [
        { id: '1', title: 'Private Database', titleBn: 'প্রাইভেট ডাটাবেস', description: 'Access to 250,000+ premium resources exclusively for VIPs.', descriptionBn: '২৫০,০০০+ প্রিমিয়াম রিসোর্সে ভিআইপিদের জন্য বিশেষ অ্যাক্সেস।', icon: 'Database', visible: true, order: 1 },
        { id: '2', title: 'AI Automation', titleBn: 'এআই অটোমেশন', description: 'Latest methods to automate your business using AI.', descriptionBn: 'এআই ব্যবহার করে আপনার ব্যবসাকে অটোমেট করার লেটেস্ট মেথড।', icon: 'Cpu', visible: true, order: 2 },
        { id: '3', title: 'Verified Quality', titleBn: 'ভেরিফাইড কোয়ালিটি', description: 'Every resource is tested and verified by our experts.', descriptionBn: 'প্রতিটি রিসোর্স আমাদের বিশেষজ্ঞরা দ্বারা পরীক্ষিত ও ভেরিফাইড।', icon: 'ShieldCheck', visible: true, order: 3 },
      ],
      setGlobalFeatures: (globalFeatures) => set({ globalFeatures }),

      navbar: {
        items: [
          { label: "Home", labelBn: "হোম", url: "/", order: 1 },
          { label: "Vault", labelBn: "ভল্ট", url: "#products", order: 2 },
          { label: "Compare", labelBn: "তুলনা", url: "#pricing", order: 3 },
          { label: "Testimonials", labelBn: "টেস্টিমোনিয়াল", url: "#reviews", order: 4 },
        ]
      },
      updateNavbar: (navbar) => set({ navbar }),

      trustBadges: [
        { id: '1', text: "Verified Secure", textBn: "ভেরিফাইড সিকিউর", icon: "Lock", visible: true, order: 1 },
        { id: '2', text: "99.9% Success", textBn: "৯৯.৯% সফলতা", icon: "TrendingUp", visible: true, order: 2 },
        { id: '3', text: "Instant Credentials", textBn: "তাৎক্ষণিক এক্সেস", icon: "Zap", visible: true, order: 3 },
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
      name: 'pro-access-hub-cms-v4',
    }
  )
);

