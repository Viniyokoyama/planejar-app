export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const reports = await prisma.report.findMany({
    where: { userId: user.id },
    include: { business: true, addresses: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reports });
}
