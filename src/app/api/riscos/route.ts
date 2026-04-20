export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { analyzeRiscos } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { businessId, address, segment } = await req.json();

  const report = await prisma.report.create({
    data: {
      userId: user.id,
      businessId: businessId || null,
      type: "riscos",
      status: "processing",
    },
  });

  (async () => {
    try {
      const result = await analyzeRiscos({ address, segment });

      if (result.alertas) {
        await Promise.all(
          result.alertas.map((a: Record<string, unknown>) =>
            prisma.riskAlert.create({
              data: {
                reportId: report.id,
                type: String(a.tipo || "outro"),
                severity: String(a.severidade || "media"),
                title: String(a.titulo || ""),
                description: String(a.descricao || ""),
                impactEstimate: Number(a.impacto_estimado) || null,
              },
            })
          )
        );
      }

      await prisma.report.update({
        where: { id: report.id },
        data: {
          status: "completed",
          overallScore: result.score_risco_geral || null,
          data: JSON.stringify(result),
        },
      });
    } catch (err) {
      await prisma.report.update({
        where: { id: report.id },
        data: { status: "failed" },
      });
      console.error("Riscos error:", err);
    }
  })();

  return NextResponse.json({ reportId: report.id, status: "processing" });
}
