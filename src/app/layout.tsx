import type { Metadata } from 'next';
import ThemeRegistry from '@/components/ThemeRegistry';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'SQL 学习站',
  description: '面向小白的数据库教学系统',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body style={{ margin: 0 }}>
        <ThemeRegistry>
          <NavBar />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
