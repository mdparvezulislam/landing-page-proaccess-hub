"use client";
import React from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { CheckCircle2 } from "lucide-react";

export const Benefits = () => {
  const { language } = useStore();

  const benefits = [
    {
      en: "Save thousands of dollars on expensive courses",
      bn: "দামি কোর্সে হাজার হাজার ডলার সাশ্রয় করুন",
    },
    {
      en: "Learn from industry experts and successful practitioners",
      bn: "ইন্ডাস্ট্রি এক্সপার্ট এবং সফল প্র্যাকটিশনারদের থেকে শিখুন",
    },
    {
      en: "Join an elite community of smart earners",
      bn: "স্মার্ট উপার্জনকারীদের একটি এলিট কমিউনিটিতে যোগ দিন",
    },
    {
      en: "Get regular updates with the latest working methods",
      bn: "লেটেস্ট ওয়ার্কিং মেথডগুলোর সাথে রেগুলার আপডেট পান",
    },
    {
      en: "Priority support from @Agent_47VIP directly",
      bn: "@Agent_47VIP থেকে সরাসরি প্রায়োরিটি সাপোর্ট পান",
    },
    {
      en: "Exclusive access to high-ticket suppliers",
      bn: "হাই-টিকিট সাপ্লায়ারদের বিশেষ অ্যাক্সেস পান",
    },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              {language === "en" ? "Transform Your " : "আপনার "}
              <span className="grad-text">
                {language === "en" ? "Digital Future" : "ডিজিটাল ভবিষ্যৎ"}
              </span>{" "}
              {language === "en" ? "Today" : "পরিবর্তন করুন"}
            </h2>
            <p className="text-lg text-text-secondary mb-10 leading-relaxed">
              {language === "en"
                ? "Join our VIP membership and get everything you need to build, scale, and automate your digital business. No more guessing, no more wasted time."
                : "আমাদের ভিআইপি মেম্বারশিপে যোগ দিন এবং আপনার ডিজিটাল বিজনেস তৈরি, স্কেল এবং অটোমেট করার জন্য প্রয়োজনীয় সবকিছু পান। আর কোনো অনুমান নয়, আর কোনো সময়ের অপচয় নয়।"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.en} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-text-primary font-medium">
                    {language === "en" ? benefit.en : benefit.bn}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-[40px] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity" />
              <div className="relative glass-card rounded-[40px] overflow-hidden border-white/10 p-2">
                <img
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200"
                  alt="Digital Workspace"
                  className="rounded-[32px] w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="glass-card p-6 rounded-2xl border-white/20 backdrop-blur-2xl">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">12,500+</p>
                        <p className="text-xs text-text-secondary uppercase font-bold tracking-widest">
                          Happy Members
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import { Users } from "lucide-react";
