import { NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

// GET /api/problems  -> 返回所有题目
export async function GET() {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT id, title, description, hint, answer, difficulty, category, sort_order
      FROM problems
      ORDER BY sort_order ASC
    `;
    return NextResponse.json({ problems: rows });
  } catch (err) {
    console.error('查询题目失败:', err);
    return NextResponse.json(
      { error: '查询题目失败' },
      { status: 500 }
    );
  }
}
