import connectDB from './mongodb';
import Settings from '@/models/Settings';
import Product from '@/models/Product';
import FAQ from '@/models/FAQ';
import Review from '@/models/Review';

export const defaultSettings = {
  hero: {
    badgeEn: "🔥 Bangladesh's Premium VIP Platform",
    badgeBn: "🔥 বাংলাদেশের এক নম্বর প্রিমিয়াম ভিআইপি প্ল্যাটফর্ম",
    titleEn: "Unlock Premium",
    titleBn: "আনলক করুন",
    titleAccentEn: "Digital Access",
    titleAccentBn: "ডিজিটাল এক্সেস",
    subtitleEn: "Get Premium Tools, Courses, Methods & Resources At The Best Price",
    subtitleBn: "সেরা মূল্যে প্রিমিয়াম টুলস, কোর্স এবং মেথড সমুহ এক জায়গায়",
    descriptionEn: "Join thousands of smart users getting access to premium tools, hidden methods, AI resources, courses, payment systems, and exclusive VIP content.",
    descriptionBn: "হাজার হাজার স্মার্ট ইউজারদের সাথে যোগ দিন যারা প্রিমিয়াম টুলস, হিডেন মেথড, AI রিসোর্স এবং এক্সক্লুসিভ ভিআইপি কন্টেন্ট এক্সেস করছে।",
    cta1En: "Get VIP Access",
    cta1Bn: "ভিআইপি এক্সেস নিন",
    cta2En: "Explore Plans",
    cta2Bn: "প্ল্যানগুলো দেখুন",
    stats: [
      { labelEn: "Happy Members", labelBn: "সন্তুষ্ট মেম্বার", valueEn: "12K+", valueBn: "১২কে+" },
      { labelEn: "Premium Resources", labelBn: "প্রিমিয়াম রিসোর্স", valueEn: "500+", valueBn: "৫০০+" },
      { labelEn: "Success Rate", labelBn: "সফলতা হার", valueEn: "99%", valueBn: "৯৯%" },
      { labelEn: "Active Support", labelBn: "অ্যাক্টিভ সাপোর্ট", valueEn: "24/7", valueBn: "২৪/৭" }
    ]
  },
  site: {
    siteNameEn: "Pro Access VIP",
    siteNameBn: "প্রো অ্যাক্সেস ভিআইপি",
    telegramLink: "https://t.me/proaccess_admin",
    telegramHandle: "@proaccess_admin",
    floatingCTAEn: "Join VIP Now",
    floatingCTABn: "এখনই জয়েন করুন",
    announcementEn: "🎉 Welcome to Pro Access VIP Hub! Check out our new 2026 methods.",
    announcementBn: "🎉 প্রো অ্যাক্সেস ভিআইপি হাবে স্বাগতম! আমাদের নতুন ২০২৬ মেথডগুলো দেখুন।",
    showAnnouncement: true,
  },
  navbar: {
    items: [
      { labelEn: "Features", labelBn: "ফিচারসমূহ", url: "#features", order: 1 },
      { labelEn: "Products", labelBn: "প্রোডাক্টস", url: "#products", order: 2 },
      { labelEn: "Pricing", labelBn: "প্রাইসিং", url: "#pricing", order: 3 },
      { labelEn: "FAQ", labelBn: "প্রশ্নোত্তর", url: "#faq", order: 4 }
    ]
  },
  footer: {
    copyrightEn: "© 2026 Pro Access VIP Hub. All Rights Reserved.",
    copyrightBn: "© ২০২৬ প্রো অ্যাক্সেস ভিআইপি হাব। সর্বস্বত্ব সংরক্ষিত।",
    links: [
      { labelEn: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", url: "/privacy" },
      { labelEn: "Terms of Service", labelBn: "টার্মস অফ সার্ভিস", url: "/terms" },
      { labelEn: "Refund Policy", labelBn: "রিফান্ড পলিসি", url: "/refund" }
    ]
  },
  countdown: {
    enabled: true,
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    titleEn: "FLASH SALE ENDING SOON!",
    titleBn: "ফ্ল্যাশ সেল দ্রুত শেষ হচ্ছে!",
    subtitleEn: "Grab your lifetime access before the price increases.",
    subtitleBn: "মূল্য বৃদ্ধির আগে আপনার লাইফটাইম এক্সেস নিশ্চিত করুন।"
  },
  trustBadges: [
    { id: '1', textEn: "Verified Vendor", textBn: "ভেরিফাইড ভেন্ডর", icon: "ShieldCheck", visible: true, order: 1 },
    { id: '2', textEn: "Instant Delivery", textBn: "ইনস্ট্যান্ট ডেলিভারি", icon: "Zap", visible: true, order: 2 },
    { id: '3', textEn: "24/7 Support", textBn: "২৪/৭ সাপোর্ট", icon: "MessageSquare", visible: true, order: 3 }
  ],
  globalFeatures: [
    { id: 'f1', titleEn: "Premium Tools", titleBn: "প্রিমিয়াম টুলস", descriptionEn: "Access Canva Pro, ChatGPT Plus methods and more.", descriptionBn: "ক্যানভা প্রো, চ্যাটজিপিটি প্লাস মেথড এবং আরও অনেক কিছু।", icon: "Zap", visible: true, order: 1 },
    { id: 'f2', titleEn: "Hidden Methods", titleBn: "হিডেন মেথড", descriptionEn: "Working methods for payment gateways and ads.", descriptionBn: "পেমেন্ট গেটওয়ে এবং বিজ্ঞাপনের জন্য কার্যকরী মেথড।", icon: "Shield", visible: true, order: 2 },
    { id: 'f3', titleEn: "VIP Community", titleBn: "ভিআইপি কমিউনিটি", descriptionEn: "Join our private Telegram group for updates.", descriptionBn: "আপডেটের জন্য আমাদের প্রাইভেট টেলিগ্রাম গ্রুপে যোগ দিন।", icon: "Users", visible: true, order: 3 }
  ],
  paymentMethods: [
    {
      id: 'bkash',
      name: 'bKash',
      number: '017XXXXXXXX',
      accountTypeEn: 'Personal (Send Money)',
      accountTypeBn: 'পার্সোনাল (সেন্ড মানি)',
      accountHolder: 'Pro Access Admin',
      instructionsEn: '1. Send exact amount\n2. Use Send Money\n3. Copy Transaction ID',
      instructionsBn: '১. সঠিক পরিমাণ টাকা পাঠান\n২. সেন্ড মানি করুন\n৩. ট্রানজেকশন আইডি কপি করুন',
      warningTextEn: 'Do not use Cash Out. We only accept Send Money.',
      warningTextBn: 'ক্যাশ আউট করবেন না। আমরা শুধুমাত্র সেন্ড মানি গ্রহণ করি।',
      color: '#E2136E',
      enabled: true,
      order: 1
    },
    {
      id: 'nagad',
      name: 'Nagad',
      number: '018XXXXXXXX',
      accountTypeEn: 'Personal',
      accountTypeBn: 'পার্সোনাল',
      accountHolder: 'Pro Access Admin',
      instructionsEn: '1. Send money to the number\n2. Fill the form',
      instructionsBn: '১. নাম্বারে টাকা পাঠান\n২. ফর্ম পূরণ করুন',
      color: '#F7941E',
      enabled: true,
      order: 2
    }
  ]
};

const defaultProducts = [
  {
    titleEn: "Method Hub - Lifetime",
    titleBn: "মেথড হাব - লাইফটাইম",
    subtitleEn: "All Working Methods & Resources",
    subtitleBn: "সব ধরণের ওয়ার্কিং মেথড এবং রিসোর্স",
    badgeEn: "BEST SELLER",
    badgeBn: "সেরা বিক্রিত",
    descriptionEn: "Access to 500+ working methods, payment gateways, and hidden resources.",
    descriptionBn: "৫০০+ কার্যকরী মেথড, পেমেন্ট গেটওয়ে এবং হিডেন রিসোর্স এক্সেস করুন।",
    buttonTextEn: "Get Lifetime Access",
    buttonTextBn: "লাইফটাইম এক্সেস নিন",
    order: 1,
    visible: true,
    plans: [
      { id: 'p1', nameEn: 'Basic Access', nameBn: 'বেসিক এক্সেস', priceTk: 500, durationEn: 'Monthly', durationBn: 'মাসিক' },
      { id: 'p2', nameEn: 'Pro Member', nameBn: 'প্রো মেম্বার', priceTk: 1200, durationEn: 'Yearly', durationBn: 'বার্ষিক' },
      { id: 'p3', nameEn: 'Legendary VIP', nameBn: 'লিজেন্ডারি ভিআইপি', priceTk: 1500, durationEn: 'Lifetime', durationBn: 'লাইফটাইম' }
    ],
    features: [
      { id: 'fe1', textEn: 'Gemini Pro Access', textBn: 'জেমিমিনাই প্রো এক্সেস', visible: true, includedInPlanIds: ['p1', 'p2', 'p3'] },
      { id: 'fe2', textEn: 'Hidden Methods Hub', textBn: 'হিডেন মেথড হাব', visible: true, includedInPlanIds: ['p2', 'p3'] },
      { id: 'fe3', textEn: 'Private DB Access', textBn: 'প্রাইভেট ডাটাবেস এক্সেস', visible: true, includedInPlanIds: ['p3'], highlighted: true }
    ],
    bulletPointsEn: [
      "All Types of Working Methods",
      "Payment Gateway Unlock Systems",
      "Step-By-Step Launch Guides",
      "Premium AI Tools Access"
    ],
    bulletPointsBn: [
      "সব ধরণের ওয়ার্কিং মেথড",
      "পেমেন্ট গেটওয়ে আনলক সিস্টেম",
      "স্টেপ-বাই-স্টেপ লঞ্চ গাইড",
      "প্রিমিয়াম AI টুলস এক্সেস"
    ]
  }
];

const defaultFAQs = [
  { questionEn: "How do I get access?", questionBn: "আমি কিভাবে এক্সেস পাব?", answerEn: "After payment, fill the order form with your transaction ID. Our team will verify and activate your access instantly.", answerBn: "পেমেন্টের পর ট্রানজেকশন আইডি দিয়ে ফর্মটি পূরণ করুন। আমাদের টিম ভেরিফাই করে দ্রুত এক্সেস দিয়ে দিবে।", order: 1, visible: true },
  { questionEn: "How long does activation take?", questionBn: "অ্যাক্টিভেশনে কতক্ষণ সময় লাগে?", answerEn: "Usually 5-30 minutes during working hours.", answerBn: "সাধারণত কর্মঘণ্টার মধ্যে ৫-৩০ মিনিট সময় লাগে।", order: 2, visible: true }
];

const defaultReviews = [
  { name: "Arif Hossain", roleEn: "Digital Marketer", roleBn: "ডিজিটাল মার্কেটার", contentEn: "The methods are actually working! Best investment so far.", contentBn: "মেথডগুলো আসলেই কাজ করছে! এখন পর্যন্ত সেরা ইনভেস্টমেন্ট।", rating: 5, avatar: "https://i.pravatar.cc/150?u=arif", visible: true },
  { name: "Sumaiya Akter", roleEn: "Freelancer", roleBn: "ফ্রিল্যান্সার", contentEn: "VIP support is amazing. They helped me set up everything.", contentBn: "ভিআইপি সাপোর্ট অসাধারণ। তারা আমাকে সবকিছু সেটআপ করতে সাহায্য করেছে।", rating: 5, avatar: "https://i.pravatar.cc/150?u=sumaiya", visible: true }
];

export async function seedDatabase() {
  await connectDB();

  // Check if data already exists to avoid duplication
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    console.log('Seeding Settings...');
    await Settings.create(defaultSettings);
  }

  const productsCount = await Product.countDocuments();
  if (productsCount === 0) {
    console.log('Seeding Products...');
    await Product.insertMany(defaultProducts);
  }

  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    console.log('Seeding FAQs...');
    await FAQ.insertMany(defaultFAQs);
  }

  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    console.log('Seeding Reviews...');
    await Review.insertMany(defaultReviews);
  }

  console.log('Database Seeding Completed Successfully!');
}
