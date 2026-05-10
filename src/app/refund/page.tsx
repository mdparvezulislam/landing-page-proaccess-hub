"use client";
import React from 'react';
import { RotateCcw } from 'lucide-react';
import { LegalHero, LegalSection } from '@/components/LegalComponents';
import { useStore } from '@/store/useStore';

export default function RefundPage() {
  const { language } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const tocItems = [
    { id: 'general', labelEn: 'General Policy', labelBn: 'সাধারণ নীতি' },
    { id: 'eligibility', labelEn: 'Refund Eligibility', labelBn: 'রিফান্ড যোগ্যতা' },
    { id: 'non-refundable', labelEn: 'Non-refundable Cases', labelBn: 'রিফান্ড অযোগ্য ক্ষেত্র' },
    { id: 'duplicate', labelEn: 'Duplicate Payments', labelBn: 'ডুপ্লিকেট পেমেন্ট' },
    { id: 'verification', labelEn: 'Verification Process', labelBn: 'যাচাইকরণ প্রক্রিয়া' },
    { id: 'contact', labelEn: 'How to Request', labelBn: 'অনুরোধ করার নিয়ম' },
  ];

  return (
    <div className="bg-bg-dark min-h-screen">
      <LegalHero
        titleEn="Refund Policy"
        titleBn="রিফান্ড নীতি"
        subtitleEn="Our policies regarding refunds and cancellations for VIP access and digital products."
        subtitleBn="ভিআইপি অ্যাক্সেস এবং ডিজিটাল পণ্যের রিফান্ড এবং বাতিলকরণ সংক্রান্ত আমাদের নীতিমালা।"
        icon={<RotateCcw className="w-8 h-8 lg:w-12 lg:h-12" />}
      />

      <div className="container mx-auto px-1 lg:px-2 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-9 max-w-4xl">
            <LegalSection id="general" titleEn="General Policy" titleBn="সাধারণ নীতি">
              <p>
                {t(
                  "Due to the nature of digital products and immediate access to premium inventory, all sales are generally final and non-refundable. Once access is granted to the VIP channels or resources, the service is considered consumed.",
                  "ডিজিটাল পণ্যের ধরণ এবং প্রিমিয়াম ইনভেন্টরিতে তাৎক্ষণিক অ্যাক্সেসের কারণে, সমস্ত বিক্রয় সাধারণত চূড়ান্ত এবং অফেরতযোগ্য। একবার ভিআইপি চ্যানেল বা রিসোর্সে অ্যাক্সেস দেওয়া হলে, পরিষেবাটি ব্যবহৃত বলে গণ্য করা হয়।"
                )}
              </p>
            </LegalSection>

            <LegalSection id="eligibility" titleEn="Refund Eligibility" titleBn="রিফান্ড যোগ্যতা">
              <p>{t("A refund may be considered only in the following exceptional cases:", "রিফান্ড শুধুমাত্র নিচের ব্যতিক্রমী ক্ষেত্রগুলোতে বিবেচনা করা যেতে পারে:")}</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>{t("The product or service was not delivered due to a technical failure on our end.", "আমাদের পক্ষ থেকে প্রযুক্তিগত ত্রুটির কারণে পণ্য বা পরিষেবা সরবরাহ করা হয়নি।")}</li>
                <li>{t("Unauthorized double-billing for the same product.", "একই পণ্যের জন্য অননুমোদিতভাবে দুবার বিল কাটা হয়েছে।")}</li>
                <li>{t("The payment was made but VIP access was not activated within 48 hours of successful verification.", "পেমেন্ট করা হয়েছে কিন্তু সফল যাচাইকরণের ৪৮ ঘণ্টার মধ্যে ভিআইপি অ্যাক্সেস সক্রিয় করা হয়নি।")}</li>
              </ul>
            </LegalSection>

            <LegalSection id="non-refundable" titleEn="Non-refundable Cases" titleBn="রিফান্ড অযোগ্য ক্ষেত্র">
              <p>{t("Refunds will NOT be provided in the following cases:", "নিচের ক্ষেত্রগুলোতে রিফান্ড দেওয়া হবে না:")}</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>{t("You changed your mind after purchasing access.", "কেনার পর আপনি আপনার সিদ্ধান্ত পরিবর্তন করেছেন।")}</li>
                <li>{t("You failed to follow the instructions for joining the VIP channels.", "ভিআইপি চ্যানেলে যোগদানের নির্দেশনা আপনি অনুসরণ করেননি।")}</li>
                <li>{t("Your account was suspended due to a violation of our Terms and Conditions.", "আমাদের শর্তাবলী লঙ্ঘনের কারণে আপনার অ্যাকাউন্ট স্থগিত করা হয়েছে।")}</li>
                <li>{t("Technical issues on your end (e.g., your Telegram account being banned).", "আপনার দিকের প্রযুক্তিগত সমস্যা (যেমন, আপনার টেলিগ্রাম অ্যাকাউন্ট ব্যান হওয়া)।")}</li>
              </ul>
            </LegalSection>

            <LegalSection id="duplicate" titleEn="Duplicate Payments" titleBn="ডুপ্লিকেট পেমেন্ট">
              <p>{t("If you accidentally made a duplicate payment for the same package, please contact us immediately with both Transaction IDs. We will refund the duplicate amount minus any transaction fees incurred by the payment processor.", "আপনি যদি ভুলবশত একই প্যাকেজের জন্য দুবার পেমেন্ট করেন, তবে উভয় ট্রানজ্যাকশন আইডি সহ অবিলম্বে আমাদের সাথে যোগাযোগ করুন। পেমেন্ট প্রসেসরের ট্রানজ্যাকশন ফি বাদ দিয়ে আমরা অতিরিক্ত পেমেন্টটি রিফান্ড করব।")}</p>
            </LegalSection>

            <LegalSection id="verification" titleEn="Verification Process" titleBn="যাচাইকরণ প্রক্রিয়া">
              <p>{t("Refund requests must include proof of payment, Transaction ID, and the registered Telegram handle. We aim to process approved refund requests within 7-10 business days through the original payment method.", "রিফান্ড অনুরোধে অবশ্যই পেমেন্টের প্রমাণ, ট্রানজ্যাকশন আইডি এবং নিবন্ধিত টেলিগ্রাম হ্যান্ডেল অন্তর্ভুক্ত থাকতে হবে। আমরা অনুমোদিত রিফান্ড অনুরোধগুলো ৭-১০ কার্যদিবসের মধ্যে মূল পেমেন্ট পদ্ধতির মাধ্যমে প্রসেস করার লক্ষ্য রাখি।")}</p>
            </LegalSection>

            <LegalSection id="contact" titleEn="How to Request" titleBn="অনুরোধ করার নিয়ম">
              <p>{t("To request a refund, please contact our support team through the official Telegram handle or bot provided in your welcome dashboard. Do not open disputes through payment gateways as it will delay the process.", "রিফান্ড অনুরোধের জন্য, আপনার ড্যাশবোর্ডে দেওয়া অফিসিয়াল টেলিগ্রাম হ্যান্ডেল বা বটের মাধ্যমে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। পেমেন্ট গেটওয়ের মাধ্যমে বিবাদ শুরু করবেন না কারণ এতে প্রক্রিয়াটি বিলম্বিত হবে।")}</p>
            </LegalSection>

            <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">
                {t("Last Updated: May 10, 2026", "সর্বশেষ আপডেট: ১০ মে, ২০২৬")}
              </p>
              <p className="text-text-secondary">
                {t("Digital goods are protected by copyright. Unauthorized distribution cancels all refund rights.", "ডিজিটাল পণ্যগুলো কপিরাইট দ্বারা সুরক্ষিত। অননুমোদিত বিতরণ সমস্ত রিফান্ড অধিকার বাতিল করে।")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
