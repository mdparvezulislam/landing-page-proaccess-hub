import { Hero } from "@/sections/Hero";
import { ProductShowcase } from "@/sections/ProductShowcase";
import { Features } from "@/sections/Features";
import { TrustBadges } from "@/sections/TrustBadges";
import { ReviewsSection } from "@/sections/ReviewsSection";
import { FAQSection } from "@/sections/FAQSection";
import { TelegramCTA } from "@/sections/TelegramCTA";
import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import Settings from "@/models/Settings";
import Review from "@/models/Review";
import FAQ from "@/models/FAQ";
import VIPPlan from "@/models/VIPPlan";
import VIPSection from "@/sections/VIPSection";
import { seedDatabase } from "@/lib/seedDatabase";

async function getData() {
  await connectDB();

  // Auto-seed if empty
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await seedDatabase();
  } else {
    const hasVIP = await VIPPlan.findOne({ featured: true });
    if (!hasVIP) {
      await seedDatabase();
    }
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

      <VIPSection />

      <ProductShowcase data={data.products} />
      <Features
        data={data.settings?.globalFeatures}
        section={data.settings?.featuresSection}
      />
      <TrustBadges data={data.settings?.trustBadges} />
      <ReviewsSection data={data.reviews} />
      <FAQSection data={data.faqs} settings={data.settings?.site} />
      <TelegramCTA data={data.settings?.site} />

      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pro Access VIP Hub",
            url:
              process.env.NEXT_PUBLIC_APP_URL ||
              "https://lifetimevipunlimited.com",
            logo: `${process.env.NEXT_PUBLIC_APP_URL || "https://lifetimevipunlimited.com"}/logo.png`,
            description:
              "Bangladesh's #1 Premium Resource Platform for smart digital success.",
            sameAs: [data.settings?.site?.telegramLink],
          }),
        }}
      />
    </div>
  );
}
