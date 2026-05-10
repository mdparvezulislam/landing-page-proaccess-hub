import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

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
        const { id } = await params;
        const session = await getServerSession();
        if (!session || (session.user as any)?.role !== 'SuperAdmin' && (session.user as any)?.role !== 'Admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const data = await req.json();
        const item = await Model.findByIdAndUpdate(id, data, { new: true });
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        return NextResponse.json(item);
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
      try {
        const { id } = await params;
        const session = await getServerSession();
        if (!session || (session.user as any)?.role !== 'SuperAdmin' && (session.user as any)?.role !== 'Admin') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const item = await Model.findByIdAndDelete(id);
        if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        return NextResponse.json({ message: 'Deleted' });
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  };
}
