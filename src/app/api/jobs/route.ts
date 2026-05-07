// Purpose: Jobs API — support isAlovlu filter and section filter.
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { jobSchema } from '@/lib/validations';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const isAlovlu = searchParams.get('isAlovlu') === 'true';
    const section = searchParams.get('section') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const where = {
      status: 'active',
      ...(isAlovlu && { isAlovlu: true }),
      ...(section && { section }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }),
    };

    const [data, total] = await Promise.all([
      prisma.job.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: [{ isAlovlu: 'desc' }, { createdAt: 'desc' }],
        include: {
          author: { select: { id: true, name: true, city: true, isVip: true, image: true } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({ success: true, data, total });
  } catch (error) {
    console.error('Jobs GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = jobSchema.parse(body);
    const { section, plan, isAlovlu, contractSigned, contractSignedAt } = body;

    const job = await prisma.job.create({
      data: {
        ...validated,
        authorId: session.user.id,
        section: section || 'bacar',
        plan: plan || null,
        isAlovlu: isAlovlu || false,
        contractSigned: contractSigned || false,
        contractSignedAt: contractSignedAt ? new Date(contractSignedAt) : null,
        paymentStatus: plan ? 'pending' : 'free',
        publishedUntil: plan ? null : null,
      },
    });

    // If alovlu, increment user's alovlu count and check VIP
    if (isAlovlu) {
      const user = await prisma.user.update({
        where: { id: session.user.id },
        data: { alovluCount: { increment: 1 } },
      });
      // Auto-grant VIP at threshold
      if (user.alovluCount >= 5 && !user.isVip) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { isVip: true },
        });
      }
    }

    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error('Jobs POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
