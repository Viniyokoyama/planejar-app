export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { analyzeDiagnostico } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { businessId, businessName, segment, description, targetAudience, avgTicket } =
    await req.json();

  const report = await prisma.report.create({
    data: {
      userId: user.id,
      businessId: businessId || null,
      type: "diagnostico",
      status: "processing",
    },
  });

  (async () => {
    try {
      const result = await analyzeDiagnostico({
        businessName,
        segment,
        description,
        targetAudience,
        avgTicket,
      });

      await prisma.report.update({
        where: { id: report.id },
        data: {
          status: "completed",
          overallScore: result.nota_geral || 0,
          data: JSON.stringify(result),
        },
      });
    } catch (err) {
      await prisma.report.update({
        where: { id: report.id },
        data: { status: "failed" },
      });
      console.error("Diagnostico error:", err);
    }
  })();

  return NextResponse.json({ reportId: report.id, status: "processing" });
}
