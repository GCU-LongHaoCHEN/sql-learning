'use client';
import { Container, Typography, Button, Box, Card, CardContent, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TerminalIcon from '@mui/icons-material/Terminal';
import Link from 'next/link';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" gutterBottom fontWeight={700}>
          欢迎来到 SQL 学习站
        </Typography>
        <Typography variant="h6" color="text.secondary">
          零基础也能学会的数据库入门教程 + 在线练习
        </Typography>
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <SchoolIcon color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" gutterBottom>学习模块</Typography>
            <Typography color="text.secondary" mb={2}>
              从"什么是数据库"开始，循序渐进学会 SELECT、WHERE、JOIN 等核心语法。
            </Typography>
            <Button variant="contained" component={Link} href="/learn">开始学习</Button>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <TerminalIcon color="secondary" sx={{ fontSize: 48 }} />
            <Typography variant="h5" gutterBottom>练习模块</Typography>
            <Typography color="text.secondary" mb={2}>
              真实数据库环境直接在浏览器里跑，边做题边查看结果。
            </Typography>
            <Button variant="contained" color="secondary" component={Link} href="/practice">去练习</Button>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
