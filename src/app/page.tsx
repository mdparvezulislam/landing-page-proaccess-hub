import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { ProductShowcase } from '@/sections/ProductShowcase';
import { Features } from '@/sections/Features';
import { TrustBadges } from '@/sections/TrustBadges';
import { Pricing } from '@/sections/Pricing';
import { ReviewsSection } from '@/sections/ReviewsSection';
import { FAQSection } from '@/sections/FAQSection';
import { CountdownBanner } from '@/sections/CountdownBanner';
import { TelegramCTA } from '@/sections/TelegramCTA';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Settings from '@/models/Settings';
import Review from '@/models/Review';
import FAQ from '@/models/FAQ';
import { seedDatabase } from '@/lib/seed';

async function getData() {
  await connectDB();
  
  // Auto-seed if empty
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await seedDatabase();
  }

  const [settings, products, reviews, faqs] = await Promise.all([
    Settings.findOne().lean(),
    Product.find({ visible: true }).sort({ order: 1 }).lean(),
    Review.find({ visible: true }).sort({ order: 1 }).lean(),
    FAQ.find({ visible: true }).sort({ order: 1 }).lean(),
  ]);

  return {
    settings: JSON.parse(JSON.stringify(settings)),
    products: JSON.parse(JSON.stringify(products)),
    reviews: JSON.parse(JSON.stringify(reviews)),
    faqs: JSON.parse(JSON.stringify(faqs)),
  };
}

export default async function Home() {
  const data = await getData();
  
  return (
    <div className="flex flex-col">
      <Hero data={data.settings?.hero} />
      <Stats data={data.settings?.hero?.stats} />
      <ProductShowcase data={data.products} />
      <Features data={data.settings?.globalFeatures} section={data.settings?.featuresSection} />
      <TrustBadges data={data.settings?.trustBadges} />
      <Pricing data={data.products} />
      <ReviewsSection data={data.reviews} />
      <FAQSection data={data.faqs} settings={data.settings?.site} />
      <CountdownBanner data={data.settings?.countdown} />
      <TelegramCTA data={data.settings?.site} />
    </div>
  );
}
