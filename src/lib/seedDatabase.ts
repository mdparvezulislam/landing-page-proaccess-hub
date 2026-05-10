import connectDB from './mongodb';
import Settings from '@/models/Settings';
import Product from '@/models/Product';
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
      password: 'pro_access_23', // Will be hashed by pre-save hook
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

  console.log('Database Seeding Completed Successfully!');
}
