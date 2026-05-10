import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { getServerSession } from 'next-auth';

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
        const session = await getServerSession();
        if (!session || session.user?.email !== 'admin@proaccess.com') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
