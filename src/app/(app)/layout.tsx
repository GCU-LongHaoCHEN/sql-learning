import { Suspense } from 'react';
import { Box } from '@mui/material';
import SideNav from '@/components/SideNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Suspense fallback={<Box sx={{ width: 240 }} />}>
        <SideNav />
      </Suspense>
      <Box sx={{ flexGrow: 1 }}>
        <Suspense fallback={null}>{children}</Suspense>
      </Box>
    </Box>
  );
}
