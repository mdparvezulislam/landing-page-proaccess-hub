import connectDB from './mongodb';
import Settings from '@/models/Settings';
import Product from '@/models/Product';
import VIPPlan from '@/models/VIPPlan';

import FAQ from '@/models/FAQ';
import Review from '@/models/Review';
import Admin from '@/models/Admin';
import { defaultData } from '@/seed/defaultData';

export async function seedDatabase() {
  await connectDB();

  // 1. Seed Admin
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    console.log('Seeding Admin...');
    await Admin.create({
      email: 'admin@proaccess.com',
      password: 'pro_access_23',
      name: 'Pro Access Admin',
      role: 'SuperAdmin'
    });
  }

  // 2. Seed Settings
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    console.log('Seeding Settings...');
    await Settings.create({
      hero: defaultData.hero,
      site: defaultData.site,
      navbar: defaultData.navbar,
      footer: defaultData.footer,
      countdown: defaultData.countdown,
      trustBadges: defaultData.trustBadges,
      globalFeatures: defaultData.globalFeatures,
      paymentSettings: defaultData.paymentSettings
    });
  }

  // 3. Seed Products
  const productsCount = await Product.countDocuments();
  if (productsCount === 0) {
    console.log('Seeding Products...');
    await Product.insertMany(defaultData.products);
  }

  // 4. Seed FAQs
  const faqCount = await FAQ.countDocuments();
  if (faqCount === 0) {
    console.log('Seeding FAQs...');
    await FAQ.insertMany(defaultData.faqs);
  }

  // 5. Seed Reviews
  const reviewCount = await Review.countDocuments();
  if (reviewCount === 0) {
    console.log('Seeding Reviews...');
    await Review.insertMany(defaultData.reviews);
  }

  // 6. Seed VIP Plan (single consolidated flagship product with all pricing inline)
  const vipPlanCount = await VIPPlan.countDocuments();
  if (vipPlanCount === 0) {
    console.log('Seeding VIP Plan...');
    await VIPPlan.create({
      titleEn: '🔥 The Ultimate VIP Resource Hub',
      titleBn: '🔥 আলটিমেট ভিআইপি রিসোর্স হাব',
      subtitleEn: 'All-in-One Premium VIP Membership — Tools, Methods, Courses & Lifetime Updates',
      subtitleBn: 'অল-ইন-ওয়ান প্রিমিয়াম ভিআইপি মেম্বারশিপ — টুলস, মেথড, কোর্স ও লাইফটাইম আপডেট',
      badgeEn: '🔥 Flagship VIP Membership',
      badgeBn: '🔥 ফ্ল্যাগশিপ ভিআইপি মেম্বারশিপ',
      shortDescriptionEn: 'The most comprehensive VIP membership on the platform. Unlock every premium tool, method, and course with flexible installment plans.',
      shortDescriptionBn: 'প্ল্যাটফর্মের সবচেয়ে সম্পূর্ণ ভিআইপি মেম্বারশিপ। ফ্লেক্সিবল ইনস্টলমেন্ট প্ল্যানে প্রতিটি প্রিমিয়াম টুল, মেথড এবং কোর্স আনলক করুন।',
      telegramLink: 'https://t.me/Agent_47VIP',
      tgPostLink: '',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
      featured: true,
      visible: true,
      order: 0,
      regularPriceBDT: 20000,
      regularPriceUSDT: 160,
      officialPriceBDT: 15000,
      officialPriceUSDT: 120,
      discountPriceBDT: 11199,
      discountPriceUSDT: 90,
      starterPaymentBDT: 5000,
      starterPaymentUSDT: 40,
      starterMonthlyBDT: 500,
      starterMonthlyUSDT: 4,
      premiumStartBDT: 3000,
      premiumStartUSDT: 24,
      premiumMonthlyBDT: 399,
      premiumMonthlyUSDT: 3,
      totalPaymentBDT: 12576,
      totalPaymentUSDT: 100,
      discountPercent: 30,
      dueEveryDays: 30,
      reminderBeforeDays: 3,
      autoReminderEnabled: false,
      enableInstallments: true,
      limitedOfferEnabled: true,
      limitedOfferPriceBDT: 9999,
      limitedOfferPriceUSDT: 80,
      limitedOfferSlots: 50,
      limitedOfferExpireDate: new Date('2026-12-31T23:59:59.000Z'),
      enableMembershipTracking: true,
      enableBanSystem: true,
      enableReminderSystem: true,
      enableNotifications: true,
      bulletPoints: [
        { id: 'bp1', textEn: '🚀 All Types of Working Methods — Updated Daily', textBn: '🚀 সব ধরণের ওয়ার্কিং মেথড — প্রতিদিন আপডেট', visible: true, order: 0, highlighted: true },
        { id: 'bp2', textEn: '💳 Payment Gateway Unlock Systems (Stripe, PayPal, 2Checkout)', textBn: '💳 পেমেন্ট গেটওয়ে আনলক সিস্টেম', visible: true, order: 1, highlighted: true },
        { id: 'bp3', textEn: '📦 Ready-To-Sell High-Ticket Digital Products', textBn: '📦 রেডি-টু-সেল হাই-টিকিট ডিজিটাল প্রোডাক্ট', visible: true, order: 2, highlighted: false },
        { id: 'bp4', textEn: '📘 Step-By-Step Launch Guides & Video Tutorials', textBn: '📘 স্টেপ-বাই-স্টেপ লঞ্চ গাইড ও ভিডিও টিউটোরিয়াল', visible: true, order: 3, highlighted: false },
        { id: 'bp5', textEn: '🤖 ChatGPT Plus, Gemini Pro & AI Tools (Free Access)', textBn: '🤖 চ্যাটজিপিটি প্লাস, জেমিনি প্রো ও এআই টুলস', visible: true, order: 4, highlighted: true },
        { id: 'bp6', textEn: '🎨 Canva Pro, Adobe Suite & Premium Design Resources', textBn: '🎨 ক্যানভা প্রো, অ্যাডোবি স্যুট ও প্রিমিয়াম ডিজাইন', visible: true, order: 5, highlighted: false },
        { id: 'bp7', textEn: '📊 Premium Courses — Affiliate Marketing, Dropshipping, Freelancing', textBn: '📊 প্রিমিয়াম কোর্স', visible: true, order: 6, highlighted: false },
        { id: 'bp8', textEn: '👥 Private VIP Telegram Group — 24/7 Dedicated Support', textBn: '👥 প্রাইভেট ভিআইপি টেলিগ্রাম গ্রুপ', visible: true, order: 7, highlighted: true },
        { id: 'bp9', textEn: '🔄 Lifetime Free Updates & New Product Additions', textBn: '🔄 লাইফটাইম ফ্রি আপডেট ও নতুন প্রোডাক্ট', visible: true, order: 8, highlighted: false },
        { id: 'bp10', textEn: '💰 Flexible Installment Payment — Starter + Monthly Plans', textBn: '💰 ফ্লেক্সিবল ইনস্টলমেন্ট পেমেন্ট', visible: true, order: 9, highlighted: true },
      ],
      keyHighlights: [
        { id: 'kh1', textEn: 'Complete Digital Arsenal', textBn: 'সম্পূর্ণ ডিজিটাল অস্ত্রাগার', visible: true, order: 0 },
        { id: 'kh2', textEn: 'Bank-Breaking Value', textBn: 'অসাধারণ মূল্য', visible: true, order: 1 },
        { id: 'kh3', textEn: 'Zero Learning Curve', textBn: 'শূন্য শেখার কার্ভ', visible: true, order: 2 },
      ],
      featureList: [
        { id: 'f1', textEn: 'Gemini Pro + 5TB Google Drive — 12 Months', textBn: 'জেমিনি প্রো + ৫টিবি গুগল ড্রাইভ — ১২ মাস', visible: true, highlighted: true, order: 1 },
        { id: 'f2', textEn: 'ChatGPT Plus Subscription — 6 Months', textBn: 'চ্যাটজিপিটি প্লাস সাবস্ক্রিপশন — ৬ মাস', visible: true, highlighted: true, order: 2 },
        { id: 'f3', textEn: 'Canva Pro — 3 Years', textBn: 'ক্যানভা প্রো — ৩ বছর', visible: true, highlighted: false, order: 3 },
        { id: 'f4', textEn: 'Adobe Photoshop Pro — 1 Year', textBn: 'অ্যাডোবি ফটোশপ প্রো — ১ বছর', visible: true, highlighted: false, order: 4 },
        { id: 'f5', textEn: 'Premium VPN — Lifetime', textBn: 'প্রিমিয়াম ভিপিএন — লাইফটাইম', visible: true, highlighted: false, order: 5 },
        { id: 'f6', textEn: 'Private VIP Telegram Group Access', textBn: 'প্রাইভেট ভিআইপি টেলিগ্রাম গ্রুপ অ্যাক্সেস', visible: true, highlighted: true, order: 6 },
        { id: 'f7', textEn: '24/7 Priority Support', textBn: '২৪/৭ প্রায়োরিটি সাপোর্ট', visible: true, highlighted: true, order: 7 },
      ],
      notices: [
        { id: 'n1', textEn: '🔥 Limited Time Offer: Save up to 30% on Premium Discount Plan', textBn: '🔥 লিমিটেড টাইম অফার', visible: true, type: 'offer' },
        { id: 'n2', textEn: '💰 Flexible installment payment available — Start with just 3,000 BDT', textBn: '💰 ফ্লেক্সিবল ইনস্টলমেন্ট পেমেন্ট', visible: true, type: 'info' },
      ],
      faqs: [
        { id: 'vq1', qEn: 'How does the installment payment work?', qBn: 'ইনস্টলমেন্ট পেমেন্ট কিভাবে কাজ করে?', aEn: 'Pay the starter fee to activate. Then pay the monthly amount every 30 days. Admin manually verifies each payment.', aBn: 'স্টার্টার ফি দিয়ে অ্যাক্টিভেট করুন। তারপর প্রতি ৩০ দিনে মাসিক পরিমাণ পরিশোধ করুন।', visible: true, order: 0 },
        { id: 'vq2', qEn: 'What happens if I miss a payment?', qBn: 'পেমেন্ট মিস করলে কি হবে?', aEn: 'You will receive reminders. After the grace period, your membership may be paused or banned.', aBn: 'আপনাকে রিমাইন্ডার পাঠানো হবে। গ্রেস পিরিয়ডের পরে আপনার মেম্বারশিপ পজ বা বন্ধ হতে পারে।', visible: true, order: 1 },
      ],
    });
  }

console.log('Database Seeding Completed Successfully!');
}
