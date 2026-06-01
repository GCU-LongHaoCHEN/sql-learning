'use client';
import { AppBar, Toolbar, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import Link from 'next/link';

// 顶栏高度：dense 模式约 48px
export const NAVBAR_HEIGHT = 48;

export default function NavBar() {
  return (
    <AppBar position="sticky" color="primary" sx={{ top: 0, zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar variant="dense" sx={{ minHeight: NAVBAR_HEIGHT }}>
        <StorageIcon sx={{ mr: 1, fontSize: 20 }} />
        <Typography variant="subtitle1" component={Link} href="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
          SQL 学习站
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
