// 建表 + 塞题目数据
// 用法：npm run seed
import { config } from 'dotenv';
config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('❌ 找不到 DATABASE_URL，请检查 .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

// difficulty: easy / medium / hard
// category:   select / where / order / group / join / subquery / aggregate
const problems = [
  // ===== Easy =====
  {
    title: '查询所有学生',
    description: '查询 students 表里的全部数据（所有列、所有行）。',
    hint: '用最基础的 SELECT 语句。* 表示选所有列，FROM 后面跟表名。',
    answer: 'SELECT * FROM students;',
    difficulty: 'easy', category: 'select',
  },
  {
    title: '查询学生姓名和年龄',
    description: '只查询 students 表中的 name 和 age 两列。',
    hint: 'SELECT 后面写要查的列名，用逗号分隔。',
    answer: 'SELECT name, age FROM students;',
    difficulty: 'easy', category: 'select',
  },
  {
    title: '筛选成年学生',
    description: '查出年龄不小于 20 岁的学生的所有信息。',
    hint: '用 WHERE 子句加 >= 比较。',
    answer: 'SELECT * FROM students WHERE age >= 20;',
    difficulty: 'easy', category: 'where',
  },
  {
    title: '查找 1組 的学生',
    description: "查出 class 为 '1組' 的全部学生。",
    hint: 'WHERE 后面用 = 比较字符串，字符串要用单引号包起来。',
    answer: "SELECT * FROM students WHERE class = '1組';",
    difficulty: 'easy', category: 'where',
  },
  {
    title: '查询女生',
    description: '查出所有女学生的姓名和班级。',
    hint: 'gender 列存的是"男"或"女"。',
    answer: "SELECT name, class FROM students WHERE gender = '女';",
    difficulty: 'easy', category: 'where',
  },
  {
    title: '按年龄排序',
    description: '查出所有学生，按年龄从大到小排序。',
    hint: 'ORDER BY 列名 DESC 表示降序；不写 DESC 默认升序（ASC）。',
    answer: 'SELECT * FROM students ORDER BY age DESC;',
    difficulty: 'easy', category: 'order',
  },

  // ===== Medium =====
  {
    title: '统计每个班的人数',
    description: '统计每个班级有多少学生，结果包含 class 和人数两列。',
    hint: '用 GROUP BY class 分组，COUNT(*) 统计每组数量。',
    answer: 'SELECT class, COUNT(*) FROM students GROUP BY class;',
    difficulty: 'medium', category: 'group',
  },
  {
    title: '统计男女比例',
    description: '统计男生和女生各有多少人。',
    hint: '按 gender 分组。',
    answer: 'SELECT gender, COUNT(*) FROM students GROUP BY gender;',
    difficulty: 'medium', category: 'group',
  },
  {
    title: '筛选年长女生',
    description: '查出年龄大于 19 岁的女学生的姓名和年龄。',
    hint: 'WHERE 里用 AND 同时满足两个条件。',
    answer: "SELECT name, age FROM students WHERE age > 19 AND gender = '女';",
    difficulty: 'medium', category: 'where',
  },
  {
    title: '课程和老师',
    description: '查出每门课的标题（title）和对应的老师姓名（name）。',
    hint: '需要把 courses 和 teachers 两张表用 JOIN 连接，连接条件是 courses.teacher_id = teachers.id。',
    answer: 'SELECT courses.title, teachers.name FROM courses JOIN teachers ON courses.teacher_id = teachers.id;',
    difficulty: 'medium', category: 'join',
  },
  {
    title: '每门课的平均分',
    description: '查询每门课程的 id 和该课的平均分。',
    hint: '按 course_id 分组，用 AVG(score) 算平均分。',
    answer: 'SELECT course_id, AVG(score) FROM scores GROUP BY course_id;',
    difficulty: 'medium', category: 'aggregate',
  },
  {
    title: '不及格成绩',
    description: '查出所有不及格（分数小于 60）的成绩记录的全部信息。',
    hint: '用 WHERE score < 60。',
    answer: 'SELECT * FROM scores WHERE score < 60;',
    difficulty: 'medium', category: 'where',
  },
  {
    title: '每个老师教几门课',
    description: '查询每个 teacher_id 教了几门课。',
    hint: '按 teacher_id 分组并 COUNT。',
    answer: 'SELECT teacher_id, COUNT(*) FROM courses GROUP BY teacher_id;',
    difficulty: 'medium', category: 'group',
  },
  {
    title: '学生总成绩',
    description: '查询每个 student_id 的所有成绩总和。',
    hint: '按 student_id 分组，用 SUM(score)。',
    answer: 'SELECT student_id, SUM(score) FROM scores GROUP BY student_id;',
    difficulty: 'medium', category: 'aggregate',
  },

  // ===== Hard =====
  {
    title: '平均分高于 80 的课',
    description: '查出平均分大于 80 的 course_id 和它的平均分。',
    hint: '分组后用 HAVING 过滤聚合结果（WHERE 不能用在聚合函数上）。',
    answer: 'SELECT course_id, AVG(score) FROM scores GROUP BY course_id HAVING AVG(score) > 80;',
    difficulty: 'hard', category: 'group',
  },
  {
    title: '高于平均年龄的学生',
    description: '查出年龄大于全体学生平均年龄的学生姓名和年龄。',
    hint: '在 WHERE 里用子查询：(SELECT AVG(age) FROM students)。',
    answer: 'SELECT name, age FROM students WHERE age > (SELECT AVG(age) FROM students);',
    difficulty: 'hard', category: 'subquery',
  },
  {
    title: '学生姓名 + 课程 + 分数',
    description: '把每条成绩展开成"学生姓名 + 课程名 + 分数"三列。',
    hint: '需要 scores、students、courses 三张表的 JOIN。',
    answer: 'SELECT students.name, courses.title, scores.score FROM scores JOIN students ON scores.student_id = students.id JOIN courses ON scores.course_id = courses.id;',
    difficulty: 'hard', category: 'join',
  },
  {
    title: '森田先生课程的成绩',
    description: '查出 森田先生 所教的所有课程的所有成绩（只需要返回 score 列）。',
    hint: '从 scores 出发，JOIN courses，再 JOIN teachers，最后 WHERE teachers.name = "森田先生"。',
    answer: "SELECT scores.score FROM scores JOIN courses ON scores.course_id = courses.id JOIN teachers ON courses.teacher_id = teachers.id WHERE teachers.name = '森田先生';",
    difficulty: 'hard', category: 'join',
  },
  {
    title: '没参加过考试的学生',
    description: '查出 scores 表里从来没有出现过的学生的姓名。',
    hint: '用 NOT IN 配合子查询：WHERE id NOT IN (SELECT student_id FROM scores)。',
    answer: 'SELECT name FROM students WHERE id NOT IN (SELECT student_id FROM scores);',
    difficulty: 'hard', category: 'subquery',
  },
  {
    title: '每个学生最高分',
    description: '查出每个 student_id 在所有课程中的最高分。',
    hint: '按 student_id 分组，用 MAX(score)。',
    answer: 'SELECT student_id, MAX(score) FROM scores GROUP BY student_id;',
    difficulty: 'hard', category: 'aggregate',
  },
];

async function main() {
  console.log('🔨 重建表 problems（含新字段 difficulty / category）...');
  await sql`DROP TABLE IF EXISTS problems`;
  await sql`
    CREATE TABLE problems (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      hint        TEXT NOT NULL,
      answer      TEXT NOT NULL,
      difficulty  TEXT NOT NULL DEFAULT 'easy',
      category    TEXT NOT NULL DEFAULT 'select',
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  console.log(`📝 插入 ${problems.length} 道题...`);
  for (let i = 0; i < problems.length; i++) {
    const p = problems[i];
    await sql`
      INSERT INTO problems (title, description, hint, answer, difficulty, category, sort_order)
      VALUES (${p.title}, ${p.description}, ${p.hint}, ${p.answer}, ${p.difficulty}, ${p.category}, ${i + 1})
    `;
  }

  const rows = await sql`SELECT id, difficulty, title FROM problems ORDER BY sort_order`;
  console.log('\n✅ 完成！当前题库：');
  rows.forEach((r) => console.log(`  #${String(r.id).padStart(2)}  [${r.difficulty.padEnd(6)}]  ${r.title}`));
}

main().catch((err) => {
  console.error('❌ 出错了：', err.message);
  process.exit(1);
});
