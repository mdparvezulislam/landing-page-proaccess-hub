import React from 'react';
import { Hero } from '../sections/Hero';
import { Stats } from '../sections/Stats';
import { ProductShowcase } from '../sections/ProductShowcase';
import { Features } from '../sections/Features';
import { Benefits } from '../sections/Benefits';
import { Pricing } from '../sections/Pricing';
import { ReviewsSection } from '../sections/ReviewsSection';
import { FAQSection } from '../sections/FAQSection';
import { CountdownBanner } from '../sections/CountdownBanner';
import { TelegramCTA } from '../sections/TelegramCTA';


export const LandingPage = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Stats />
      <ProductShowcase />
      <Features />
      <Benefits />
      <Pricing />
      <ReviewsSection />
      <FAQSection />
      <CountdownBanner />
      <TelegramCTA />
    </div>
  );
};
