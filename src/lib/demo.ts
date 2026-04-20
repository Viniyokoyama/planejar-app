export const DEMO_USER = {
  id: "demo-user-id",
  name: "Usuário Demo",
  email: "demo@planejar.com.br",
  plan: "profissional",
};

export const DEMO_PASSWORD = "senha123";
export const DEMO_PASSWORD_HASH = "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PlenBO";

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "1" || process.env.VERCEL === "1";
}
