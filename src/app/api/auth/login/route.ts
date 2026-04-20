export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { comparePassword, createToken } from "@/lib/auth";
import { DEMO_USER, DEMO_PASSWORD, isDemoMode } from "@/lib/demo";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (isDemoMode()) {
    if (email !== DEMO_USER.email || password !== DEMO_PASSWORD) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }
    const token = await createToken({ userId: DEMO_USER.id, email: DEMO_USER.email });
    const response = NextResponse.json({ user: DEMO_USER });
    response.cookies.set("planejar_token", token, {
      httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/",
    });
    return response;
  }

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });

  const valid = await comparePassword(password, user.password);
  if (!valid) return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });

  const token = await createToken({ userId: user.id, email: user.email });
  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
  });
  response.cookies.set("planejar_token", token, {
    httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: "/",
  });
  return response;
}
