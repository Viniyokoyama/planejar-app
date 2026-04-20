export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { analyzeConcorrencia } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { businessId, businessName, segment, address } = await req.json();

  const report = await prisma.report.create({
    data: {
      userId: user.id,
      businessId: businessId || null,
      type: "concorrencia",
      status: "processing",
    },
  });

  (async () => {
    try {
      const result = await analyzeConcorrencia({ businessName, segment, address });

      if (result.concorrentes) {
        await Promise.all(
          result.concorrentes.map((c: Record<string, unknown>) =>
            prisma.competitor.create({
              data: {
                reportId: report.id,
                name: String(c.nome || ""),
                address: String(c.endereco || address),
                platform: "google_maps",
                rating: Number(c.rating) || null,
                sentimentPos: Number(c.sentimento_positivo) || null,
                sentimentNeg: Number(c.sentimento_negativo) || null,
                strengths: JSON.stringify(c.pontos_fortes || []),
                weaknesses: JSON.stringify(c.pontos_fracos || []),
              },
            })
          )
        );
      }

      await prisma.report.update({
        where: { id: report.id },
        data: {
          status: "completed",
          data: JSON.stringify(result),
        },
      });
    } catch (err) {
      await prisma.report.update({
        where: { id: report.id },
        data: { status: "failed" },
      });
      console.error("Concorrencia error:", err);
    }
  })();

  return NextResponse.json({ reportId: report.id, status: "processing" });
}
