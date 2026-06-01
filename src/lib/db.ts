import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 未配置，请检查 .env.local 或 Vercel 环境变量');
}

export const sql = neon(process.env.DATABASE_URL);
