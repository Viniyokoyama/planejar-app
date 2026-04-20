export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { analyzeGeomarketing } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const { addresses, businessId, segment, targetAudience, avgTicket } = await req.json();

  if (!addresses || addresses.length === 0) {
    return NextResponse.json({ error: "Informe pelo menos um endereço." }, { status: 400 });
  }

  const report = await prisma.report.create({
    data: {
      userId: user.id,
      businessId: businessId || null,
      type: "geomarketing",
      status: "processing",
    },
  });

  (async () => {
    try {
      const results = await Promise.all(
        addresses.map((addr: string) =>
          analyzeGeomarketing({ address: addr, segment, targetAudience, avgTicket })
        )
      );

      const createdAddresses = await Promise.all(
        addresses.map((addr: string, i: number) =>
          prisma.address.create({
            data: {
              reportId: report.id,
              rawAddress: addr,
              scores: JSON.stringify(results[i].scores || {}),
              overallScore: results[i].nota_geral || 0,
              analysis: results[i].resumo || "",
            },
          })
        )
      );

      const overallScore =
        createdAddresses.reduce((sum, a) => sum + (a.overallScore || 0), 0) /
        createdAddresses.length;

      await prisma.report.update({
        where: { id: report.id },
        data: {
          status: "completed",
          overallScore,
          data: JSON.stringify({ results }),
        },
      });
    } catch (err) {
      await prisma.report.update({
        where: { id: report.id },
        data: { status: "failed" },
      });
      console.error("Geomarketing analysis error:", err);
    }
  })();

  return NextResponse.json({ reportId: report.id, status: "processing" });
}
