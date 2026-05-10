import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { verifyAdmin } from '@/lib/adminAuth';

export function createCollectionItemRoute(Model: any) {
  return {
    async GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
      try {
        const { id } = await params;
        await connectDB();
        const item = await Model.findById(id);
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        return NextResponse.json(item);
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
      try {
        const { valid } = await verifyAdmin();
        if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await connectDB();
        const data = await req.json().catch(() => null);
        if (!data) return NextResponse.json({ error: 'Invalid or missing data' }, { status: 400 });

        const item = await Model.findByIdAndUpdate(id, data, { new: true });
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        revalidatePath('/');
        return NextResponse.json(item);
      } catch (error: any) {
        console.error(`PATCH Collection Item Error:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
      try {
        const { valid } = await verifyAdmin();
        if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        await connectDB();
        const item = await Model.findByIdAndDelete(id);
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        revalidatePath('/');
        return NextResponse.json({ message: 'Deleted' });
      } catch (error: any) {
        console.error(`DELETE Collection Item Error:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  };
}
