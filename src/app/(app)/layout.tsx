import { Suspense } from 'react';
import { Box } from '@mui/material';
import SideNav from '@/components/SideNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Suspense fallback={<Box sx={{ width: 240 }} />}>
        <SideNav />
      </Suspense>
      <Box sx={{ flexGrow: 1, height: '100vh', overflowY: 'auto' }}>
        <Suspense fallback={null}>{children}</Suspense>
      </Box>
    </Box>
  );
}
