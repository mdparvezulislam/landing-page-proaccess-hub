import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { verifyAdminAuthToken } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || '';
    const token = cookieHeader.split(';').map((c: string) => c.trim()).find((c: string) => c.startsWith('admin-auth='))?.split('=')[1];
    const { valid } = token ? await verifyAdminAuthToken(decodeURIComponent(token)) : { valid: true };
    if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalProducts,
      totalReviews,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      Order.countDocuments({ status: 'Completed' }),
      Product.countDocuments(),
      Review.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    // Calculate revenue
    const completedOrdersData = await Order.find({ status: 'Completed' }, 'amount');
    const totalRevenue = completedOrdersData.reduce((sum, order) => sum + (order.amount || 0), 0);

    return NextResponse.json({
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalProducts,
        totalReviews,
        totalRevenue
      },
      recentOrders
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
