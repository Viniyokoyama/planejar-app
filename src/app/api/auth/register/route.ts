import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password, segment } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Campos obrigatórios faltando." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, plan: "starter" },
  });

  if (segment) {
    await prisma.business.create({
      data: {
        userId: user.id,
        name: `Negócio de ${name}`,
        segment,
      },
    });
  }

  const token = await createToken({ userId: user.id, email: user.email });

  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan },
  });
  response.cookies.set("planejar_token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
