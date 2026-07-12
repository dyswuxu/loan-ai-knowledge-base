import './globals.css';

export const metadata = {
  title: '贷款AI知识库系统',
  description: '基于RAG的贷款产品智能匹配与风控分析系统',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
