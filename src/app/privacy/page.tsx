"use client";
import React from 'react';
import { Shield } from 'lucide-react';
import { LegalHero, LegalSection } from '@/components/LegalComponents';
import { useStore } from '@/store/useStore';

export default function PrivacyPage() {
  const { language } = useStore();
  const t = (en: string, bn: string) => language === 'en' ? en : bn;

  const tocItems = [
    { id: 'introduction', labelEn: 'Introduction', labelBn: 'ভূমিকা' },
    { id: 'collection', labelEn: 'Data Collection', labelBn: 'তথ্য সংগ্রহ' },
    { id: 'usage', labelEn: 'How We Use Data', labelBn: 'তথ্যের ব্যবহার' },
    { id: 'security', labelEn: 'Data Security', labelBn: 'তথ্য নিরাপত্তা' },
    { id: 'telegram', labelEn: 'Telegram & Communications', labelBn: 'টেলিগ্রাম এবং যোগাযোগ' },
    { id: 'third-party', labelEn: 'Third Party Services', labelBn: 'তৃতীয় পক্ষের পরিষেবা' },
    { id: 'rights', labelEn: 'User Rights', labelBn: 'ব্যবহারকারীর অধিকার' },
  ];

  return (
    <div className="bg-bg-dark min-h-screen">
      <LegalHero
        titleEn="Privacy Policy"
        titleBn="গোপনীয়তা নীতি"
        subtitleEn="Learn how we protect your information and maintain your privacy at Pro Access VIP Hub."
        subtitleBn="প্রো অ্যাক্সেস ভিআইপি হাবে আমরা কীভাবে আপনার তথ্য সুরক্ষিত রাখি এবং আপনার গোপনীয়তা বজায় রাখি তা জানুন।"
        icon={<Shield className="w-8 h-8 lg:w-12 lg:h-12" />}
      />

      <div className="container mx-auto px-1 lg:px-2 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-9 max-w-4xl">
            <LegalSection id="introduction" titleEn="Introduction" titleBn="ভূমিকা">
              <p>
                {t(
                  "Welcome to Pro Access VIP Hub. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.",
                  "প্রো অ্যাক্সেস ভিআইপি হাবে আপনাকে স্বাগতম। আমরা আপনার ব্যক্তিগত তথ্য এবং আপনার গোপনীয়তার অধিকার রক্ষা করতে প্রতিশ্রুতিবদ্ধ। আমাদের নীতি বা আপনার ব্যক্তিগত তথ্য সম্পর্কিত আমাদের অনুশীলন সম্পর্কে আপনার যদি কোনো প্রশ্ন বা উদ্বেগ থাকে তবে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।"
                )}
              </p>
              <p className="mt-4">
                {t(
                  "This privacy policy applies to all information collected through our website and related services, including our VIP membership platform and Telegram channels.",
                  "এই গোপনীয়তা নীতি আমাদের ওয়েবসাইট এবং সম্পর্কিত পরিষেবাগুলির মাধ্যমে সংগৃহীত সমস্ত তথ্যের ক্ষেত্রে প্রযোজ্য, যার মধ্যে আমাদের ভিআইপি মেম্বারশিপ প্ল্যাটফর্ম এবং টেলিগ্রাম চ্যানেল অন্তর্ভুক্ত রয়েছে।"
                )}
              </p>
            </LegalSection>

            <LegalSection id="collection" titleEn="Information Collection" titleBn="তথ্য সংগ্রহ">
              <p>{t("We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services.", "আপনি যখন ওয়েবসাইটে নিবন্ধন করেন, আমাদের বা আমাদের পণ্য এবং পরিষেবাগুলি সম্পর্কে তথ্য পেতে আগ্রহ প্রকাশ করেন তখন আপনি স্বেচ্ছায় আমাদের যে ব্যক্তিগত তথ্য সরবরাহ করেন তা আমরা সংগ্রহ করি।")}</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li><strong>{t("Personal Data:", "ব্যক্তিগত তথ্য:")}</strong> {t("Name, email address, and Telegram handle.", "নাম, ইমেল ঠিকানা এবং টেলিগ্রাম হ্যান্ডেল।")}</li>
                <li><strong>{t("Payment Data:", "পেমেন্ট তথ্য:")}</strong> {t("We collect data necessary to process your payment if you make purchases, such as transaction IDs from bKash, Nagad, or other methods.", "আপনি যদি কেনাকাটা করেন তবে আপনার পেমেন্ট প্রসেস করার জন্য প্রয়োজনীয় তথ্য আমরা সংগ্রহ করি, যেমন বিকাশ, নগদ বা অন্যান্য মাধ্যমের ট্রানজ্যাকশন আইডি।")}</li>
                <li><strong>{t("Device Data:", "ডিভাইস তথ্য:")}</strong> {t("IP addresses, browser type, and operating system.", "আইপি ঠিকানা, ব্রাউজারের ধরণ এবং অপারেটিং সিস্টেম।")}</li>
              </ul>
            </LegalSection>

            <LegalSection id="usage" titleEn="How We Use Your Information" titleBn="আমরা কীভাবে তথ্য ব্যবহার করি">
              <p>{t("We use personal information collected via our website for a variety of business purposes described below:", "আমরা আমাদের ওয়েবসাইটের মাধ্যমে সংগৃহীত ব্যক্তিগত তথ্য নিচে বর্ণিত বিভিন্ন ব্যবসায়িক উদ্দেশ্যে ব্যবহার করি:")}</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>{t("To facilitate account creation and logon process.", "অ্যাকাউন্ট তৈরি এবং লগইন প্রক্রিয়া সহজতর করতে।")}</li>
                <li>{t("To fulfill and manage your orders, payments, and VIP access.", "আপনার অর্ডার, পেমেন্ট এবং ভিআইপি অ্যাক্সেস পূর্ণ এবং পরিচালনা করতে।")}</li>
                <li>{t("To send administrative information to you (e.g., changes to terms).", "আপনাকে প্রশাসনিক তথ্য পাঠাতে (যেমন, শর্তাবলীতে পরিবর্তন)।")}</li>
                <li>{t("To protect our services from fraud and unauthorized access.", "প্রতারণা এবং অননুমোদিত অ্যাক্সেস থেকে আমাদের পরিষেবাগুলি রক্ষা করতে।")}</li>
              </ul>
            </LegalSection>

            <LegalSection id="security" titleEn="Data Security" titleBn="তথ্য নিরাপত্তা">
              <p>{t("We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.", "আমরা যে কোনও ব্যক্তিগত তথ্যের নিরাপত্তা রক্ষার জন্য যথাযথ প্রযুক্তিগত এবং সাংগঠনিক নিরাপত্তা ব্যবস্থা বাস্তবায়ন করেছি। তবে, দয়া করে মনে রাখবেন যে আমরা গ্যারান্টি দিতে পারি না যে ইন্টারনেট নিজেই ১০০% নিরাপদ।")}</p>
            </LegalSection>

            <LegalSection id="telegram" titleEn="Telegram & Communications" titleBn="টেলিগ্রাম এবং যোগাযোগ">
              <p>{t("Our VIP services rely heavily on Telegram. By joining our VIP platform, you agree to receive communications through our official Telegram channels and bots. We do not share your Telegram handle with any third parties unrelated to the delivery of our services.", "আমাদের ভিআইপি পরিষেবাগুলি মূলত টেলিগ্রামের উপর নির্ভরশীল। আমাদের ভিআইপি প্ল্যাটফর্মে যোগদানের মাধ্যমে, আপনি আমাদের অফিসিয়াল টেলিগ্রাম চ্যানেল এবং বটের মাধ্যমে যোগাযোগ পেতে সম্মত হন। আমরা আপনার টেলিগ্রাম হ্যান্ডেল আমাদের পরিষেবার সাথে সম্পর্কহীন কোনো তৃতীয় পক্ষের সাথে শেয়ার করি না।")}</p>
            </LegalSection>

            <LegalSection id="third-party" titleEn="Third Party Services" titleBn="তৃতীয় পক্ষের পরিষেবা">
              <p>{t("We may use third-party services for payments (e.g., payment gateways) and analytics (e.g., Facebook Pixel, Google Analytics). These services have their own privacy policies and we recommend you read them.", "আমরা পেমেন্ট (যেমন পেমেন্ট গেটওয়ে) এবং অ্যানালিটিক্সের (যেমন ফেসবুক পিক্সেল, গুগল অ্যানালিটিক্স) জন্য তৃতীয় পক্ষের পরিষেবা ব্যবহার করতে পারি। এই পরিষেবাগুলির নিজস্ব গোপনীয়তা নীতি রয়েছে এবং আমরা আপনাকে সেগুলো পড়ার পরামর্শ দিই।")}</p>
            </LegalSection>

            <LegalSection id="rights" titleEn="Your Rights" titleBn="আপনার অধিকার">
              <p>{t("You have the right to request access to your personal information, request corrections, or ask for the deletion of your data. To exercise these rights, please contact our support team via Telegram.", "আপনার ব্যক্তিগত তথ্য দেখার অনুরোধ করার, সংশোধনের অনুরোধ করার বা আপনার তথ্য মুছে ফেলার অনুরোধ করার অধিকার আপনার রয়েছে। এই অধিকারগুলি প্রয়োগ করতে, অনুগ্রহ করে টেলিগ্রামের মাধ্যমে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।")}</p>
            </LegalSection>

            <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest mb-4">
                {t("Last Updated: May 10, 2026", "সর্বশেষ আপডেট: ১০ মে, ২০২৬")}
              </p>
              <p className="text-text-secondary">
                {t("If you have any questions, contact us at support@proaccess.vip", "আপনার যদি কোনো প্রশ্ন থাকে, তবে support@proaccess.vip এ আমাদের সাথে যোগাযোগ করুন")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
