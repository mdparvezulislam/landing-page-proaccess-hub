"use client";
import React from 'react';
import { ScrollText } from 'lucide-react';
import { LegalHero, LegalSection } from '@/components/LegalComponents';
import { useStore } from '@/store/useStore';

export default function TermsPage() {
  const { language } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const tocItems = [
    { id: 'agreement', labelEn: 'Agreement', labelBn: 'চুক্তি' },
    { id: 'membership', labelEn: 'Membership Rules', labelBn: 'সদস্যতা নিয়মাবলী' },
    { id: 'restrictions', labelEn: 'Usage Restrictions', labelBn: 'ব্যবহারের বিধিনিষেধ' },
    { id: 'payments', labelEn: 'Payments & Verification', labelBn: 'পেমেন্ট এবং যাচাইকরণ' },
    { id: 'intellectual', labelEn: 'Intellectual Property', labelBn: 'মেধাস্বত্ব' },
    { id: 'suspension', labelEn: 'Account Suspension', labelBn: 'অ্যাকাউন্ট স্থগিতকরণ' },
    { id: 'disclaimer', labelEn: 'Disclaimer', labelBn: 'দাবিত্যাগ' },
  ];

  return (
    <div className="bg-bg-dark min-h-screen">
      <LegalHero
        titleEn="Terms & Conditions"
        titleBn="শর্তাবলী"
        subtitleEn="Please read these terms carefully before using the Pro Access VIP Hub platform."
        subtitleBn="প্রো অ্যাক্সেস ভিআইপি হাব প্ল্যাটফর্মটি ব্যবহার করার আগে দয়া করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।"
        icon={<ScrollText className="w-8 h-8 lg:w-12 lg:h-12" />}
      />

      <div className="container mx-auto px-1 lg:px-2 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-9 max-w-4xl">
            <LegalSection id="agreement" titleEn="Agreement to Terms" titleBn="শর্তাবলীতে সম্মতি">
              <p>
                {t(
                  "By accessing or using Pro Access VIP Hub, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.",
                  "প্রো অ্যাক্সেস ভিআইপি হাব অ্যাক্সেস বা ব্যবহার করার মাধ্যমে, আপনি এই শর্তাবলীর সাথে সম্মত হন। আপনি যদি শর্তাবলীর কোনো অংশের সাথে একমত না হন, তবে আপনি পরিষেবাটি অ্যাক্সেস করতে পারবেন না।"
                )}
              </p>
            </LegalSection>

            <LegalSection id="membership" titleEn="Membership Rules" titleBn="সদস্যতা নিয়মাবলী">
              <p>{t("When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account.", "আপনি যখন আমাদের সাথে একটি অ্যাকাউন্ট তৈরি করেন, তখন আপনাকে অবশ্যই সঠিক, সম্পূর্ণ এবং সর্বদা বর্তমান তথ্য প্রদান করতে হবে। এটি করতে ব্যর্থ হলে শর্তাবলী লঙ্ঘন হবে, যার ফলে আপনার অ্যাকাউন্ট অবিলম্বে বন্ধ হয়ে যেতে পারে।")}</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>{t("One membership is valid for one individual only.", "একটি সদস্যতা শুধুমাত্র একজন ব্যক্তির জন্য বৈধ।")}</li>
                <li>{t("You are responsible for safeguarding your access to the platform and Telegram channels.", "প্ল্যাটফর্ম এবং টেলিগ্রাম চ্যানেলে আপনার অ্যাক্সেস সুরক্ষিত রাখার জন্য আপনি দায়ী।")}</li>
                <li>{t("You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.", "আপনার অ্যাকাউন্টের কোনো নিরাপত্তা লঙ্ঘন বা অননুমোদিত ব্যবহার সম্পর্কে অবগত হওয়ার সাথে সাথে আমাদের জানাতে হবে।")}</li>
              </ul>
            </LegalSection>

            <LegalSection id="restrictions" titleEn="Usage Restrictions" titleBn="ব্যবহারের বিধিনিষেধ">
              <p>{t("You are expressly restricted from all of the following:", "আপনি স্পষ্টভাবে নিচের সবকিছুর জন্য নিষিদ্ধ:")}</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>{t("Sharing, selling, or redistributing our premium resources and methods.", "আমাদের প্রিমিয়াম রিসোর্স এবং মেথড শেয়ার করা, বিক্রি করা বা পুনরায় বিতরণ করা।")}</li>
                <li>{t("Using the platform for any illegal purpose or activity.", "যেকোনো অবৈধ উদ্দেশ্য বা কার্যকলাপের জন্য প্ল্যাটফর্ম ব্যবহার করা।")}</li>
                <li>{t("Attempting to bypass access controls or hack the system.", "অ্যাক্সেস কন্ট্রোল বাইপাস করার চেষ্টা করা বা সিস্টেম হ্যাক করার চেষ্টা করা।")}</li>
                <li>{t("Spamming or harassing other members in the community.", "কমিউনিটির অন্যান্য সদস্যদের স্প্যাম করা বা হয়রানি করা।")}</li>
              </ul>
            </LegalSection>

            <LegalSection id="payments" titleEn="Payments & Verification" titleBn="পেমেন্ট এবং যাচাইকরণ">
              <p>{t("All payments are processed manually or through automated verification. You must provide a valid Transaction ID for all manual payments (bKash/Nagad/Rocket). Access will only be granted once the payment is successfully verified by our system or admin team.", "সমস্ত পেমেন্ট ম্যানুয়ালি বা স্বয়ংক্রিয় যাচাইকরণের মাধ্যমে প্রসেস করা হয়। সমস্ত ম্যানুয়াল পেমেন্টের (বিকাশ/নগদ/রকেট) জন্য আপনাকে অবশ্যই একটি বৈধ ট্রানজ্যাকশন আইডি প্রদান করতে হবে। পেমেন্ট আমাদের সিস্টেম বা অ্যাডমিন টিম দ্বারা সফলভাবে যাচাই করার পরেই অ্যাক্সেস প্রদান করা হবে।")}</p>
            </LegalSection>

            <LegalSection id="intellectual" titleEn="Intellectual Property" titleBn="মেধাস্বত্ব">
              <p>{t("The platform and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Pro Access VIP Hub. Our content is protected by copyright and other laws.", "প্ল্যাটফর্ম এবং এর আসল বিষয়বস্তু (ব্যবহারকারীদের দেওয়া বিষয়বস্তু বাদে), বৈশিষ্ট্য এবং কার্যকারিতা প্রো অ্যাক্সেস ভিআইপি হাবে এর একচেটিয়া সম্পত্তি এবং থাকবে। আমাদের বিষয়বস্তু কপিরাইট এবং অন্যান্য আইন দ্বারা সুরক্ষিত।")}</p>
            </LegalSection>

            <LegalSection id="suspension" titleEn="Account Suspension" titleBn="অ্যাকাউন্ট স্থগিতকরণ">
              <p>{t("We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.", "আমরা কোনো পূর্ব নোটিশ বা দায়বদ্ধতা ছাড়াই অবিলম্বে আপনার অ্যাকাউন্ট বন্ধ বা স্থগিত করতে পারি, যদি আপনি শর্তাবলী লঙ্ঘন করেন তবে কোনো সীমাবদ্ধতা ছাড়াই।")}</p>
            </LegalSection>

            <LegalSection id="disclaimer" titleEn="Disclaimer" titleBn="দাবিত্যাগ">
              <p>{t("The materials on Pro Access VIP Hub are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability or fitness for a particular purpose.", "প্রো অ্যাক্সেস ভিআইপি হাবের উপকরণগুলি 'যেমন আছে' সেভাবেই প্রদান করা হয়। আমরা কোনো ওয়ারেন্টি প্রদান করি না এবং এর মাধ্যমে সমস্ত ওয়ারেন্টি অস্বীকার করি।")}</p>
            </LegalSection>

            <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">
                {t("Last Updated: May 10, 2026", "সর্বশেষ আপডেট: ১০ মে, ২০২৬")}
              </p>
              <p className="text-text-secondary">
                {t("Violation of these terms will result in immediate permanent ban without refund.", "এই শর্তাবলী লঙ্ঘন করলে কোনো রিফান্ড ছাড়াই অবিলম্বে স্থায়ীভাবে নিষিদ্ধ করা হবে।")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
