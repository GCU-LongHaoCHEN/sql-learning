'use client';
import { Container, Typography, Paper, Divider } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { chapters } from '@/lib/chapters';

export default function LearnPage() {
  const searchParams = useSearchParams();
  const idx = Math.min(Math.max(Number(searchParams.get('c') ?? 0), 0), chapters.length - 1);
  const chapter = chapters[idx];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>{chapter.title}</Typography>
      <Divider sx={{ mb: 3 }} />
      <Paper sx={{ p: 3, whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: 1.8 }}>
        {chapter.content}
      </Paper>
    </Container>
  );
}
