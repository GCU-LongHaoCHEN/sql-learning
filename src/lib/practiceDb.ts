// 浏览器内 SQLite（练习用的"假想数据库"）的初始化 SQL
// 数据内容使用日语，方便用日语场景练习
export const PRACTICE_SETUP_SQL = `
CREATE TABLE teachers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL
);
INSERT INTO teachers VALUES (1, '森田先生', '数学');
INSERT INTO teachers VALUES (2, '川島先生', '英語');
INSERT INTO teachers VALUES (3, '藤井先生', '物理');
INSERT INTO teachers VALUES (4, '池田先生', '化学');
INSERT INTO teachers VALUES (5, '大塚先生', '体育');

CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  class TEXT NOT NULL,
  enrolled_year INTEGER NOT NULL
);
INSERT INTO students VALUES (1,  '田中 太郎',   20, '男', '1組', 2023);
INSERT INTO students VALUES (2,  '鈴木 花子',   19, '女', '1組', 2023);
INSERT INTO students VALUES (3,  '高橋 健',     22, '男', '2組', 2022);
INSERT INTO students VALUES (4,  '佐藤 美咲',   18, '女', '2組', 2024);
INSERT INTO students VALUES (5,  '渡辺 雅子',   21, '女', '3組', 2022);
INSERT INTO students VALUES (6,  '山田 翔太',   19, '男', '1組', 2023);
INSERT INTO students VALUES (7,  '中村 由紀',   20, '女', '3組', 2023);
INSERT INTO students VALUES (8,  '小林 大輔',   22, '男', '2組', 2022);
INSERT INTO students VALUES (9,  '加藤 結衣',   18, '女', '1組', 2024);
INSERT INTO students VALUES (10, '吉田 健太',   21, '男', '3組', 2022);
INSERT INTO students VALUES (11, '山本 さくら', 19, '女', '2組', 2023);
INSERT INTO students VALUES (12, '佐々木 拓也', 23, '男', '3組', 2021);
INSERT INTO students VALUES (13, '岡田 美穂',   20, '女', '1組', 2023);
INSERT INTO students VALUES (14, '松本 涼',     18, '男', '2組', 2024);
INSERT INTO students VALUES (15, '井上 千夏',   21, '女', '3組', 2022);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  teacher_id INTEGER NOT NULL,
  credits INTEGER NOT NULL
);
INSERT INTO courses VALUES (1, '微積分',     1, 4);
INSERT INTO courses VALUES (2, '英会話',     2, 3);
INSERT INTO courses VALUES (3, '力学',       3, 4);
INSERT INTO courses VALUES (4, '一般化学',   4, 3);
INSERT INTO courses VALUES (5, '体育',       5, 1);
INSERT INTO courses VALUES (6, '線形代数',   1, 3);
INSERT INTO courses VALUES (7, '英文法',     2, 2);
INSERT INTO courses VALUES (8, '物理実験',   3, 2);

CREATE TABLE scores (
  id INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  score INTEGER NOT NULL
);
INSERT INTO scores VALUES (1,  1, 1, 85);
INSERT INTO scores VALUES (2,  1, 2, 72);
INSERT INTO scores VALUES (3,  1, 3, 90);
INSERT INTO scores VALUES (4,  2, 1, 78);
INSERT INTO scores VALUES (5,  2, 2, 88);
INSERT INTO scores VALUES (6,  2, 4, 55);
INSERT INTO scores VALUES (7,  3, 1, 92);
INSERT INTO scores VALUES (8,  3, 3, 81);
INSERT INTO scores VALUES (9,  3, 6, 75);
INSERT INTO scores VALUES (10, 4, 2, 95);
INSERT INTO scores VALUES (11, 4, 5, 88);
INSERT INTO scores VALUES (12, 4, 7, 91);
INSERT INTO scores VALUES (13, 5, 3, 67);
INSERT INTO scores VALUES (14, 5, 4, 73);
INSERT INTO scores VALUES (15, 5, 8, 82);
INSERT INTO scores VALUES (16, 6, 1, 58);
INSERT INTO scores VALUES (17, 6, 2, 76);
INSERT INTO scores VALUES (18, 6, 5, 90);
INSERT INTO scores VALUES (19, 7, 2, 84);
INSERT INTO scores VALUES (20, 7, 6, 79);
INSERT INTO scores VALUES (21, 7, 7, 88);
INSERT INTO scores VALUES (22, 8, 1, 71);
INSERT INTO scores VALUES (23, 8, 3, 85);
INSERT INTO scores VALUES (24, 8, 8, 49);
INSERT INTO scores VALUES (25, 9, 2, 93);
INSERT INTO scores VALUES (26, 9, 4, 80);
INSERT INTO scores VALUES (27, 9, 5, 87);
INSERT INTO scores VALUES (28, 10, 1, 65);
INSERT INTO scores VALUES (29, 10, 3, 70);
INSERT INTO scores VALUES (30, 10, 6, 88);
INSERT INTO scores VALUES (31, 11, 2, 81);
INSERT INTO scores VALUES (32, 11, 4, 92);
INSERT INTO scores VALUES (33, 11, 7, 77);
INSERT INTO scores VALUES (34, 12, 1, 89);
INSERT INTO scores VALUES (35, 12, 6, 95);
INSERT INTO scores VALUES (36, 12, 8, 72);
INSERT INTO scores VALUES (37, 13, 2, 86);
INSERT INTO scores VALUES (38, 13, 3, 78);
INSERT INTO scores VALUES (39, 13, 5, 90);
INSERT INTO scores VALUES (40, 14, 1, 52);
INSERT INTO scores VALUES (41, 14, 4, 68);
INSERT INTO scores VALUES (42, 14, 7, 73);
INSERT INTO scores VALUES (43, 15, 3, 94);
INSERT INTO scores VALUES (44, 15, 6, 82);
INSERT INTO scores VALUES (45, 15, 8, 91);
`;
