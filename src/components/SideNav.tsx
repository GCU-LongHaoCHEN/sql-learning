'use client';
import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Box, Typography } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import SchoolIcon from '@mui/icons-material/School';
import StorageIcon from '@mui/icons-material/Storage';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { chapters } from '@/lib/chapters';

const drawerWidth = 240;
export const SIDENAV_HEADER_HEIGHT = 56;

export default function SideNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentChapter = Number(searchParams.get('c') ?? 0);

  const isPractice = pathname.startsWith('/practice');

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 0,
          height: '100vh',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* 顶部品牌区（蓝色背景，原本顶栏的位置） */}
      <Box
        component={Link}
        href="/"
        sx={{
          height: SIDENAV_HEADER_HEIGHT,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          textDecoration: 'none',
          gap: 1,
        }}
      >
        <StorageIcon sx={{ fontSize: 22 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          SQL 学习站
        </Typography>
      </Box>

      <List sx={{ pt: 1 }}>
        <ListItemButton
          selected={isPractice}
          onClick={() => router.push('/practice')}
        >
          <ListItemIcon sx={{ minWidth: 36 }}><TerminalIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="练习" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItemButton>
      </List>

      <Divider />

      <List>
        <ListItem sx={{ py: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><SchoolIcon color="primary" /></ListItemIcon>
          <ListItemText primary="学习" primaryTypographyProps={{ fontWeight: 600 }} />
        </ListItem>
      </List>

      <List sx={{ pt: 0 }}>
        {chapters.map((c, i) => {
          const selected = !isPractice && i === currentChapter;
          return (
            <ListItemButton
              key={i}
              selected={selected}
              onClick={() => router.push(`/learn?c=${i}`)}
            >
              <ListItemText primary={c.title} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
