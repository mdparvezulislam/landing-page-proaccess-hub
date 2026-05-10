import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import Product from '@/models/Product';
import FAQ from '@/models/FAQ';
import Review from '@/models/Review';
import { verifyAdmin } from '@/lib/adminAuth';

export async function GET() {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const [settings, products, faqs, reviews] = await Promise.all([
      Settings.find().lean(),
      Product.find().lean(),
      FAQ.find().lean(),
      Review.find().lean(),
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      settings,
      products,
      faqs,
      reviews,
    };

    return NextResponse.json(backupData, {
      headers: {
        'Content-Disposition': `attachment; filename=backup-${new Date().toISOString()}.json`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Backup GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { valid } = await verifyAdmin();
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const backupData = await req.json().catch(() => null);
    if (!backupData) return NextResponse.json({ error: 'Invalid or missing backup data' }, { status: 400 });

    await connectDB();

    // WARNING: This replaces current data
    if (backupData.settings) {
      await Settings.deleteMany({});
      await Settings.insertMany(backupData.settings);
    }
    if (backupData.products) {
      await Product.deleteMany({});
      await Product.insertMany(backupData.products);
    }
    if (backupData.faqs) {
      await FAQ.deleteMany({});
      await FAQ.insertMany(backupData.faqs);
    }
    if (backupData.reviews) {
      await Review.deleteMany({});
      await Review.insertMany(backupData.reviews);
    }

    return NextResponse.json({ message: 'Restore completed successfully' });
  } catch (error: any) {
    console.error('Backup POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
