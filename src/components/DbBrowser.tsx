'use client';
import { useState, useMemo } from 'react';
import {
  Paper, Tabs, Tab, Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Stack,
} from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = any;

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
    <Paper sx={{ overflow: 'hidden' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', px: 2 }}>
        <TableChartIcon sx={{ mr: 1 }} color="action" />
        <Typography variant="subtitle2" sx={{ mr: 2 }}>数据库浏览器</Typography>
        <Tabs value={Math.min(tab, tables.length - 1)} onChange={(_, v) => setTab(v)} variant="scrollable">
          {tables.map((t: string) => <Tab key={t} label={t} />)}
        </Tabs>
      </Box>

      {tableData && (
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} mb={1.5} flexWrap="wrap" useFlexGap>
            {tableData.schema.map((col) => (
              <Chip
                key={String(col[1])}
                size="small"
                label={`${col[1]} : ${col[2]}${col[5] ? ' 🔑' : ''}`}
                variant="outlined"
              />
            ))}
          </Stack>
          <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {tableData.columns.map((c: string) => (
                    <TableCell key={c}><strong>{c}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.rows.map((row: unknown[], i: number) => (
                  <TableRow key={i} hover>
                    {row.map((v, j) => <TableCell key={j}>{v === null ? <em style={{ color: '#999' }}>NULL</em> : String(v)}</TableCell>)}
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
