'use client';
import { useState, useMemo } from 'react';
import {
  Paper, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = any;

// 不同 SQL 类型用不同颜色，方便区分
const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  INTEGER: { bg: '#E3F2FD', color: '#1565C0' }, // 蓝
  REAL:    { bg: '#E0F7FA', color: '#00838F' }, // 青
  TEXT:    { bg: '#E8F5E9', color: '#2E7D32' }, // 绿
  BLOB:    { bg: '#FCE4EC', color: '#AD1457' }, // 粉
  NUMERIC: { bg: '#FFF3E0', color: '#E65100' }, // 橙
};
const DEFAULT_TYPE_COLOR = { bg: '#F5F5F5', color: '#616161' };

export default function DbBrowser({ db, refreshKey = 0 }: { db: Db | null; refreshKey?: number }) {
  const [tab, setTab] = useState(0);

  const tables = useMemo(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
      if (!res.length) return [];
      return res[0].values.map((r: unknown[]) => String(r[0]));
    } catch {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, refreshKey]);

  const tableData = useMemo(() => {
    if (!db || !tables.length) return null;
    const name = tables[Math.min(tab, tables.length - 1)];
    try {
      const schemaRes = db.exec(`PRAGMA table_info(${name})`);
      const dataRes = db.exec(`SELECT * FROM ${name} LIMIT 100`);
      return {
        name,
        schema: schemaRes[0]?.values ?? [],
        columns: dataRes[0]?.columns ?? [],
        rows: dataRes[0]?.values ?? [],
      };
    } catch {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, tables, tab, refreshKey]);

  if (!db) {
    return <Paper sx={{ p: 2 }}><Typography color="text.secondary">数据库加载中...</Typography></Paper>;
  }
  if (!tables.length) {
    return <Paper sx={{ p: 2 }}><Typography color="text.secondary">数据库中暂无表</Typography></Paper>;
  }

  return (
    <Paper sx={{ overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      {/* 顶部条带：浅紫渐变 */}
      <Box
        sx={{
          background: 'linear-gradient(90deg, #EDE7F6 0%, #E8EAF6 100%)',
          borderBottom: '2px solid',
          borderColor: 'secondary.main',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 0.5,
        }}
      >
        <TableChartIcon sx={{ mr: 1, color: 'secondary.main' }} />
        <Typography variant="subtitle2" sx={{ mr: 2, fontWeight: 700, color: 'secondary.dark' }}>
          数据库浏览器
        </Typography>
        <Tabs
          value={Math.min(tab, tables.length - 1)}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: 13,
            },
          }}
        >
          {tables.map((t: string) => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>

      {tableData && (
        <Box sx={{ p: 2 }}>
          <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {tableData.columns.map((c: string) => {
                    // PRAGMA table_info 返回：[cid, name, type, notnull, dflt_value, pk]
                    const meta = tableData.schema.find((s) => String(s[1]) === c);
                    const type = meta ? String(meta[2]).toUpperCase() : '';
                    const isPk = meta ? !!meta[5] : false;
                    const typeStyle = TYPE_COLORS[type] ?? DEFAULT_TYPE_COLOR;
                    return (
                      <TableCell
                        key={c}
                        sx={{
                          verticalAlign: 'top',
                          whiteSpace: 'nowrap',
                          bgcolor: '#FAFAFA',
                          borderBottom: '2px solid',
                          borderBottomColor: 'primary.light',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <strong style={{ color: '#212121' }}>{c}</strong>
                          {isPk && <span style={{ fontSize: 11 }}>🔑</span>}
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-block',
                            mt: 0.3,
                            px: 0.7,
                            py: 0.1,
                            borderRadius: 0.5,
                            bgcolor: typeStyle.bg,
                            color: typeStyle.color,
                            fontSize: 10,
                            fontWeight: 600,
                            lineHeight: 1.4,
                          }}
                        >
                          {type}
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.rows.map((row: unknown[], i: number) => (
                  <TableRow
                    key={i}
                    hover
                    sx={{
                      bgcolor: i % 2 === 1 ? '#FAFBFC' : 'transparent',
                      '&:hover': { bgcolor: '#E3F2FD !important' },
                    }}
                  >
                    {row.map((v, j) => {
                      const colName = tableData.columns[j];
                      const meta = tableData.schema.find((s) => String(s[1]) === colName);
                      const type = meta ? String(meta[2]).toUpperCase() : '';
                      const isNumeric = type === 'INTEGER' || type === 'REAL' || type === 'NUMERIC';
                      return (
                        <TableCell
                          key={j}
                          sx={{
                            fontFamily: isNumeric ? 'monospace' : undefined,
                            color: isNumeric ? '#1565C0' : 'inherit',
                            fontWeight: isNumeric ? 500 : 400,
                          }}
                        >
                          {v === null ? <em style={{ color: '#BDBDBD' }}>NULL</em> : String(v)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            共 {tableData.rows.length} 行（最多显示 100 行）
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
