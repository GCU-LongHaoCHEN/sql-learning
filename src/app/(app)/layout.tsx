import { Box } from '@mui/material';
import SideNav from '@/components/SideNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideNav />
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
