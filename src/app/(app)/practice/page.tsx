'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Container, Typography, Paper, Button, Box, Alert, Stack, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, Collapse,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CodeMirror from '@uiw/react-codemirror';
import { sql as sqlLang, MySQL } from '@codemirror/lang-sql';
import { keymap } from '@codemirror/view';
import DbBrowser from '@/components/DbBrowser';
import { PRACTICE_SETUP_SQL } from '@/lib/practiceDb';
import { diffResults, type QueryResult, type DiffReport } from '@/lib/sqlDiff';

type Problem = {
  id: number;
  title: string;
  description: string;
  hint: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
};

const DIFF_LABELS: Record<Problem['difficulty'], { label: string; color: 'success' | 'warning' | 'error' }> = {
  easy:   { label: '简单', color: 'success' },
  medium: { label: '中等', color: 'warning' },
  hard:   { label: '困难', color: 'error' },
};

const CATEGORY_LABELS: Record<string, string> = {
  select: 'SELECT',
  where: 'WHERE',
  order: 'ORDER BY',
  group: 'GROUP BY',
  join: 'JOIN',
  subquery: '子查询',
  aggregate: '聚合函数',
};

export default function PracticePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [db, setDb] = useState<any>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [problemIdx, setProblemIdx] = useState(0);
  const [code, setCode] = useState('SELECT * FROM students;');
  const [userResult, setUserResult] = useState<QueryResult | null>(null);
  const [expectedResult, setExpectedResult] = useState<QueryResult | null>(null);
  const [verdict, setVerdict] = useState<DiffReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbVersion, setDbVersion] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const runSqlRef = useRef<() => void>(() => {});

  // 加载浏览器内 SQLite（练习用的"假想数据库"）
  useEffect(() => {
    (async () => {
      const initSqlJs = (await import('sql.js')).default;
      const SQL = await initSqlJs({ locateFile: (f) => `/${f}` });
      const database = new SQL.Database();
      database.run(PRACTICE_SETUP_SQL);
      setDb(database);
      setLoading(false);
    })();
  }, []);

  // 从后端 API 拉题目
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/problems');
        const data = await res.json();
        setProblems(data.problems ?? []);
      } catch (e) {
        console.error('拉取题目失败:', e);
      } finally {
        setProblemsLoading(false);
      }
    })();
  }, []);

  const problem = problems[problemIdx];

  const resetProblemState = () => {
    setUserResult(null);
    setExpectedResult(null);
    setVerdict(null);
    setError(null);
    setShowHint(false);
    setShowAnswer(false);
    setCode('');
  };

  const switchToProblem = (idx: number) => {
    setProblemIdx(idx);
    resetProblemState();
  };

  const randomProblem = () => {
    if (problems.length <= 1) return;
    let next = problemIdx;
    while (next === problemIdx) {
      next = Math.floor(Math.random() * problems.length);
    }
    switchToProblem(next);
  };

  const runSql = () => {
    setError(null);
    setUserResult(null);
    setExpectedResult(null);
    setVerdict(null);
    if (!db || !problem) return;

    // 1. 跑用户 SQL
    let userRes: QueryResult;
    try {
      const res = db.exec(code);
      userRes = res.length === 0
        ? { columns: [], values: [] }
        : res[res.length - 1];
    } catch (e) {
      setError((e as Error).message);
      return;
    }

    // 2. 跑参考答案 SQL（用一个临时干净的 DB，避免互相影响）
    let expectedRes: QueryResult;
    try {
      const res = db.exec(problem.answer);
      expectedRes = res.length === 0
        ? { columns: [], values: [] }
        : res[res.length - 1];
    } catch (e) {
      console.error('参考答案执行出错:', e);
      // 即使参考答案出问题也展示用户结果
      setUserResult(userRes);
      setDbVersion((v) => v + 1);
      return;
    }

    // 3. 比对
    const report = diffResults(userRes, expectedRes);
    setUserResult(userRes);
    setExpectedResult(expectedRes);
    setVerdict(report);
    setDbVersion((v) => v + 1);
  };

  // 把最新的 runSql 同步到 ref，让 CodeMirror keymap 总是调到最新版
  useEffect(() => {
    runSqlRef.current = runSql;
  });

  // CodeMirror 扩展：SQL 高亮 + Cmd/Ctrl+Enter 运行
  const editorExtensions = useMemo(() => [
    sqlLang({ dialect: MySQL, upperCaseKeywords: false }),
    keymap.of([
      {
        key: 'Mod-Enter',
        run: () => {
          runSqlRef.current?.();
          return true;
        },
      },
    ]),
  ], []);

  const resetDb = async () => {
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs({ locateFile: (f) => `/${f}` });
    const database = new SQL.Database();
    database.run(PRACTICE_SETUP_SQL);
    setDb(database);
    setUserResult(null);
    setExpectedResult(null);
    setVerdict(null);
    setError(null);
    setDbVersion((v) => v + 1);
  };

  if (problemsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>SQL 练习</Typography>
        <Typography color="text.secondary">题目加载中...</Typography>
      </Container>
    );
  }

  if (!problem) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>SQL 练习</Typography>
        <Alert severity="warning">暂无题目数据</Alert>
      </Container>
    );
  }

  const diffLabel = DIFF_LABELS[problem.difficulty] ?? { label: problem.difficulty, color: 'default' as const };
  const categoryLabel = CATEGORY_LABELS[problem.category] ?? problem.category;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">SQL 练习</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ShuffleIcon />}
          onClick={randomProblem}
        >
          随机出题
        </Button>
      </Stack>

      <Paper
        elevation={3}
        sx={{
          p: 2.5,
          mb: 2,
          position: 'sticky',
          top: 0,
          zIndex: 5,
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
              <Chip size="small" label={diffLabel.label} color={diffLabel.color} />
              <Chip size="small" label={categoryLabel} variant="outlined" />
              <Typography variant="caption" color="text.disabled">#{problem.id}</Typography>
            </Stack>
            <Typography variant="h6">{problem.title}</Typography>
            <Typography color="text.secondary">{problem.description}</Typography>
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

      <Box sx={{ mb: 2 }}>
        <DbBrowser db={db} refreshKey={dbVersion} />
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
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
            extensions={editorExtensions}
            onChange={setCode}
            basicSetup={{ lineNumbers: true, highlightActiveLine: true }}
          />
        </Box>
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={runSql} disabled={loading}>
            {loading ? '数据库加载中...' : '运行并判题'}
          </Button>
          <Typography variant="caption" color="text.secondary">
            ⌨️ 快捷键：⌘/Ctrl + Enter
          </Typography>
        </Box>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {verdict && <VerdictBanner verdict={verdict} onNext={randomProblem} />}

      {userResult && (
        <ResultsView
          userResult={userResult}
          expectedResult={expectedResult}
          verdict={verdict}
        />
      )}
    </Container>
  );
}

// ---------- 判题横幅 ----------
function VerdictBanner({ verdict, onNext }: { verdict: DiffReport; onNext: () => void }) {
  if (verdict.correct) {
    return (
      <Alert
        severity="success"
        icon={<CheckCircleIcon />}
        sx={{ mb: 2, fontWeight: 600 }}
        action={
          <Button color="inherit" size="small" startIcon={<ShuffleIcon />} onClick={onNext}>
            下一题
          </Button>
        }
      >
        🎉 完全正确！查询结果与参考答案完全一致。
      </Alert>
    );
  }
  return (
    <Alert severity="error" icon={<CancelIcon />} sx={{ mb: 2 }}>
      <strong>结果不一致：</strong>{verdict.reason || '请检查你的查询语句'}
    </Alert>
  );
}

// ---------- 结果展示（含对比） ----------
function ResultsView({
  userResult,
  expectedResult,
  verdict,
}: {
  userResult: QueryResult;
  expectedResult: QueryResult | null;
  verdict: DiffReport | null;
}) {
  const showCompare = !!verdict && !verdict.correct && !!expectedResult;

  if (!showCompare) {
    // 不需要对比时，只显示用户结果
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>查询结果</Typography>
        <ResultTable result={userResult} highlightRows={null} highlightColor="" />
      </Paper>
    );
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <Paper sx={{ p: 2, flex: 1, borderLeft: '4px solid', borderLeftColor: 'error.main' }}>
        <Typography variant="subtitle1" gutterBottom>
          ❌ 你的结果（{userResult.values.length} 行）
        </Typography>
        <ResultTable
          result={userResult}
          highlightRows={verdict!.userExtraRows}
          highlightColor="rgba(244, 67, 54, 0.15)"
          highlightTitle="多余的行"
        />
      </Paper>
      <Paper sx={{ p: 2, flex: 1, borderLeft: '4px solid', borderLeftColor: 'success.main' }}>
        <Typography variant="subtitle1" gutterBottom>
          ✅ 正确结果（{expectedResult!.values.length} 行）
        </Typography>
        <ResultTable
          result={expectedResult!}
          highlightRows={verdict!.expectedMissingRows}
          highlightColor="rgba(76, 175, 80, 0.18)"
          highlightTitle="你漏查的行"
        />
      </Paper>
    </Stack>
  );
}

// ---------- 通用结果表格 ----------
function ResultTable({
  result,
  highlightRows,
  highlightColor,
  highlightTitle,
}: {
  result: QueryResult;
  highlightRows: Set<number> | null;
  highlightColor: string;
  highlightTitle?: string;
}) {
  if (result.columns.length === 0) {
    return <Typography color="text.secondary">执行成功，无返回数据。</Typography>;
  }
  return (
    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {result.columns.map((c) => (
              <TableCell key={c}><strong>{c}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {result.values.map((row, i) => {
            const isHighlighted = highlightRows?.has(i);
            return (
              <TableRow
                key={i}
                sx={{ backgroundColor: isHighlighted ? highlightColor : undefined }}
                title={isHighlighted ? highlightTitle : undefined}
              >
                {row.map((v, j) => (
                  <TableCell key={j}>{v === null ? <em style={{ color: '#999' }}>NULL</em> : String(v)}</TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
}
