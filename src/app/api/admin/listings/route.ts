// Purpose: Admin API — list all job listings with filters.
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const section = searchParams.get('section') || '';
    const isAlovlu = searchParams.get('isAlovlu') === 'true';

    const where: any = {
      ...(section && { section }),
      ...(isAlovlu && { isAlovlu: true }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ isAlovlu: 'desc' }, { createdAt: 'desc' }],
        include: {
          author: { select: { id: true, name: true, email: true, isVip: true } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: jobs, total });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId, action } = await req.json();

    let update = {};
    if (action === 'approve') update = { paymentStatus: 'paid', status: 'active' };
    if (action === 'reject') update = { status: 'closed' };
    if (action === 'makeAlovlu') update = { isAlovlu: true, alovluUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };

    const job = await prisma.job.update({ where: { id: jobId }, data: update });
    return NextResponse.json({ success: true, job });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
