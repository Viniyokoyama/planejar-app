import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "node:path";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const url = `file:${dbPath}`;
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Rodando seed...");

  const passwordHash = await bcrypt.hash("senha123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@planejar.com.br" },
    update: {},
    create: {
      name: "Usuário Demo",
      email: "demo@planejar.com.br",
      password: passwordHash,
      plan: "profissional",
    },
  });
  console.log(`✅ Usuário demo: ${user.email}`);

  const specialists = [
    { id: "spec-1", name: "Ana Lima", specialty: "Geomarketing e Localização", bio: "Especialista em pontos comerciais com 10 anos de experiência.", rating: 4.9, sessionsCount: 120 },
    { id: "spec-2", name: "Carlos Motta", specialty: "Estratégia Empresarial", bio: "Consultor com foco em PMEs e franchising.", rating: 4.8, sessionsCount: 98 },
    { id: "spec-3", name: "Renata Souza", specialty: "Marketing e Posicionamento", bio: "Especialista em branding para pequenos negócios.", rating: 4.7, sessionsCount: 75 },
  ];
  for (const s of specialists) {
    await prisma.specialist.upsert({ where: { id: s.id }, update: {}, create: s });
  }
  console.log("✅ Especialistas criados");

  console.log("\n🚀 Seed concluído!");
  console.log("   Acesse: http://localhost:3000");
  console.log("   Login: demo@planejar.com.br | Senha: senha123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
