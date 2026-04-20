import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const businesses = await prisma.business.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ businesses });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json();
  const business = await prisma.business.create({
    data: {
      userId: user.id,
      name: body.name,
      segment: body.segment,
      targetAudience: body.targetAudience,
      avgTicket: body.avgTicket ? parseFloat(body.avgTicket) : null,
      description: body.description,
      openingHours: body.openingHours,
    },
  });
  return NextResponse.json({ business });
}
