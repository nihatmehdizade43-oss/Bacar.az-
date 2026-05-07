// Purpose: Admin API — list all users with stats.
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
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          city: true,
          profession: true,
          verificationStatus: true,
          isVip: true,
          alovluCount: true,
          bannedAt: true,
          createdAt: true,
          _count: { select: { jobs: true, applications: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: users, total, page, limit });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, action } = await req.json();

    let update = {};
    if (action === 'ban') update = { bannedAt: new Date() };
    if (action === 'unban') update = { bannedAt: null };
    if (action === 'makeVip') update = { isVip: true, vipUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) };
    if (action === 'removeVip') update = { isVip: false, vipUntil: null };
    if (action === 'verify') update = { verificationStatus: 'verified' };

    const user = await prisma.user.update({ where: { id: userId }, data: update });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
