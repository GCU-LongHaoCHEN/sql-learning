import { neon } from '@neondatabase/serverless';

// 懒加载：模块导入时不连接数据库，避免构建阶段（preview build 等）
// 因为缺 DATABASE_URL 就崩溃。真正缺配置时，会在首次请求时报错。
let _sql: ReturnType<typeof neon> | null = null;

export function getSql() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL 未配置，请检查 Vercel 环境变量');
  }
  _sql = neon(url);
  return _sql;
}
