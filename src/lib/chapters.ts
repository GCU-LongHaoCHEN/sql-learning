export const chapters = [
  {
    title: '1. 什么是数据库',
    content: `数据库（Database）就像一个超大号的 Excel 表格集合，专门用来存储和管理数据。\n\n常见的数据库系统有 MySQL、PostgreSQL、SQLite 等。我们用 SQL（结构化查询语言）来跟数据库对话。`,
  },
  {
    title: '2. 表、行、列',
    content: `一个数据库里有很多"表"（Table）。\n- 表的每一"行"（Row）代表一条数据记录\n- 每一"列"（Column）代表一个字段\n\n比如学生表，每行是一个学生，列可能有：学号、姓名、年龄。`,
  },
  {
    title: '3. SELECT 查询',
    content: `SELECT 是 SQL 里最常用的命令，用来"读取数据"。\n\n示例：\n  SELECT * FROM students;\n表示"从 students 表里选所有列的所有行"。`,
  },
  {
    title: '4. WHERE 过滤',
    content: `WHERE 子句用来筛选数据。\n\n示例：\n  SELECT name FROM students WHERE age > 18;\n表示"从 students 表里选出年龄大于 18 的学生姓名"。`,
  },
  {
    title: '5. JOIN 连接',
    content: `JOIN 用来把多张表的数据拼起来。\n\n示例：\n  SELECT s.name, c.title\n  FROM students s\n  JOIN courses c ON s.course_id = c.id;`,
  },
];
