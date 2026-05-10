import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { verifyAdminAuthToken } from '@/lib/adminAuth';

export function createSettingsSectionRoute(sectionName: string) {
  return {
    async GET() {
      try {
        await connectDB();
        const settings = await Settings.findOne();
        return NextResponse.json(settings?.[sectionName] || {});
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async POST(req: Request) {
      try {
        const cookieHeader = req.headers.get('cookie') || '';
        const token = cookieHeader.split(';').map((c) => c.trim()).find((c) => c.startsWith('admin-auth='))?.split('=')[1];
        const { valid } = token ? await verifyAdminAuthToken(decodeURIComponent(token)) : { valid: false };
        if (!valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectDB();
        const data = await req.json();
        let settings = await Settings.findOne();

        if (settings) {
          settings[sectionName] = data;
          await settings.save();
        } else {
          settings = await Settings.create({ [sectionName]: data });
        }

        return NextResponse.json(settings[sectionName]);
      } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  };
}
