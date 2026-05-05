// Purpose: Admin stats API — registration counts by time period.
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: { message: "Forbidden" } },
        { status: 403 },
      );
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalJobs,
      totalApplications,
      todayUsers,
      weekUsers,
      monthUsers,
      activeJobs,
      pendingApps,
      recentUsers,
      recentJobs,
      recentApps,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.job.count({ where: { status: "active" } }),
      prisma.application.count({ where: { status: "pending" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          city: true,
          createdAt: true,
        },
      }),
      prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: { select: { name: true, email: true } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true, email: true } },
          job: { select: { title: true } },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalJobs,
          totalApplications,
          todayUsers,
          weekUsers,
          monthUsers,
          activeJobs,
          pendingApps,
        },
        recentUsers,
        recentJobs,
        recentApps,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 },
    );
  }
}
