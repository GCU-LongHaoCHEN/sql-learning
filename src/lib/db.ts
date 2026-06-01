import { neon } from '@neondatabase/serverless';

// 注意：不在模块顶层抛错，避免预览环境/构建阶段没配 DATABASE_URL 就崩溃。
// 真正的错误延后到首次执行 SQL 时（request 期间）。
export const sql = neon(process.env.DATABASE_URL ?? '');
