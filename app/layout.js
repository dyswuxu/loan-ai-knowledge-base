import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: '贷款AI知识库系统',
  description: '助贷公司业务人员智能助手',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
