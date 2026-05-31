'use client';
import { Drawer, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Toolbar } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import SchoolIcon from '@mui/icons-material/School';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { chapters } from '@/lib/chapters';

const drawerWidth = 240;

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
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', top: 64 },
      }}
    >
      <Toolbar sx={{ minHeight: '0 !important' }} />
      <List>
        <ListItemButton
          selected={isPractice}
          onClick={() => router.push('/practice')}
          sx={{ bgcolor: isPractice ? undefined : 'action.hover' }}
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
