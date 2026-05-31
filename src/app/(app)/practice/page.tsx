'use client';
import { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Button, Box, Alert, Stack, Chip,
  Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Collapse from '@mui/material/Collapse';
import CodeMirror from '@uiw/react-codemirror';
import { sql, MySQL } from '@codemirror/lang-sql';
import DbBrowser from '@/components/DbBrowser';

const SETUP_SQL = `
CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, class TEXT);
INSERT INTO students VALUES (1, '张三', 20, '一班');
INSERT INTO students VALUES (2, '李四', 19, '一班');
INSERT INTO students VALUES (3, '王五', 22, '二班');
INSERT INTO students VALUES (4, '赵六', 18, '二班');
INSERT INTO students VALUES (5, '孙七', 21, '三班');

CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT, teacher TEXT);
INSERT INTO courses VALUES (1, '数学', '陈老师');
INSERT INTO courses VALUES (2, '英语', '林老师');
INSERT INTO courses VALUES (3, '物理', '吴老师');
`;

const problems = [
  {
    title: '题目 1：查询所有学生',
    desc: '请写出 SQL 查询 students 表里的全部数据。',
    hint: '用最基础的 SELECT 语句。* 表示选所有列，FROM 后面跟表名。',
    answer: 'SELECT * FROM students;',
  },
  {
    title: '题目 2：筛选年龄',
    desc: '查出年龄大于 19 岁的学生姓名和年龄。',
    hint: '只选 name 和 age 两列；用 WHERE 加上 age > 19 的过滤条件。',
    answer: 'SELECT name, age FROM students WHERE age > 19;',
  },
  {
    title: '题目 3：分组统计',
    desc: '统计每个班级有多少学生。',
    hint: '需要"按班级分组"，用 GROUP BY class；统计数量用聚合函数 COUNT(*)。',
    answer: 'SELECT class, COUNT(*) FROM students GROUP BY class;',
  },
];

type QueryResult = { columns: string[]; values: unknown[][] };

export default function PracticePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [db, setDb] = useState<any>(null);
  const [problemIdx, setProblemIdx] = useState(0);
  const [code, setCode] = useState('SELECT * FROM students;');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbVersion, setDbVersion] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    (async () => {
      const initSqlJs = (await import('sql.js')).default;
      const SQL = await initSqlJs({ locateFile: (f) => `https://sql.js.org/dist/${f}` });
      const database = new SQL.Database();
      database.run(SETUP_SQL);
      setDb(database);
      setLoading(false);
    })();
  }, []);

  const runSql = () => {
    setError(null);
    setResult(null);
    if (!db) return;
    try {
      const res = db.exec(code);
      setResult(res.length === 0 ? { columns: [], values: [] } : res[res.length - 1]);
      setDbVersion((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const resetDb = async () => {
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs({ locateFile: (f) => `https://sql.js.org/dist/${f}` });
    const database = new SQL.Database();
    database.run(SETUP_SQL);
    setDb(database);
    setResult(null);
    setError(null);
    setDbVersion((v) => v + 1);
  };

  const problem = problems[problemIdx];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>SQL 练习</Typography>

      <Stack direction="row" spacing={1} mb={2}>
        {problems.map((p, i) => (
          <Chip
            key={i}
            label={`第 ${i + 1} 题`}
            color={i === problemIdx ? 'primary' : 'default'}
            onClick={() => { setProblemIdx(i); setResult(null); setError(null); setShowHint(false); setShowAnswer(false); }}
          />
        ))}
      </Stack>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{problem.title}</Typography>
            <Typography color="text.secondary">{problem.desc}</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant={showHint ? 'contained' : 'outlined'}
              color="warning"
              startIcon={<LightbulbOutlinedIcon />}
              onClick={() => setShowHint((v) => !v)}
            >
              提示
            </Button>
            <Button
              size="small"
              variant={showAnswer ? 'contained' : 'outlined'}
              color="info"
              startIcon={<VisibilityOutlinedIcon />}
              onClick={() => setShowAnswer((v) => !v)}
            >
              参考答案
            </Button>
          </Stack>
        </Stack>

        <Collapse in={showHint}>
          <Alert severity="warning" icon={<LightbulbOutlinedIcon />} sx={{ mt: 2 }}>
            <strong>思路分析：</strong>{problem.hint}
          </Alert>
        </Collapse>
        <Collapse in={showAnswer}>
          <Alert severity="info" sx={{ mt: 2, fontFamily: 'monospace' }}>
            <strong>参考答案：</strong>{problem.answer}
          </Alert>
        </Collapse>
      </Paper>

      <Box mb={2}>
        <DbBrowser db={db} refreshKey={dbVersion} />
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle2">SQL 编辑器</Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" startIcon={<RestartAltIcon />} onClick={resetDb}>重置数据库</Button>
            <Button size="small" color="error" startIcon={<DeleteOutlinedIcon />} onClick={() => setCode('')}>清空</Button>
          </Stack>
        </Stack>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
          <CodeMirror
            value={code}
            height="160px"
            extensions={[sql({ dialect: MySQL, upperCaseKeywords: false })]}
            onChange={setCode}
            basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
          />
        </Box>
        <Box mt={2}>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={runSql} disabled={loading}>
            {loading ? '数据库加载中...' : '运行'}
          </Button>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>查询结果</Typography>
          {result.columns.length === 0 ? (
            <Typography color="text.secondary">执行成功，无返回数据。</Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  {result.columns.map((c) => <TableCell key={c}><strong>{c}</strong></TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {result.values.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((v, j) => <TableCell key={j}>{String(v)}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Container>
  );
}
