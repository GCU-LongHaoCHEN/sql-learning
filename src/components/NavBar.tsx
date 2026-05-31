'use client';
import { AppBar, Toolbar, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import Link from 'next/link';

export default function NavBar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <StorageIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          SQL 学习站
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
