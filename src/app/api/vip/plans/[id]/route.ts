import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VIPPlan from '@/models/VIPPlan';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    await VIPPlan.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete VIP plan' }, { status: 500 });
  }
}
