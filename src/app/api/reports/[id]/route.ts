export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { id } = await params;
  const report = await prisma.report.findFirst({
    where: { id, userId: user.id },
    include: {
      addresses: true,
      competitors: true,
      riskAlerts: true,
      business: true,
    },
  });

  if (!report) return NextResponse.json({ error: "Relatório não encontrado." }, { status: 404 });

  return NextResponse.json({ report });
}
