'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Mock data for display
  const mockCustomers = [
    { id: '1', name: '上海XX贸易有限公司', industry: '商贸', risk_rating: 'B', status: 'active', created_at: '2026-07-14' },
    { id: '2', name: '杭州XX科技有限公司', industry: '科技', risk_rating: 'A', status: 'active', created_at: '2026-07-13' },
  ];

  const displayCustomers = customers.length > 0 ? customers : mockCustomers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">客户管理</h1>
          <p className="text-gray-500 mt-1">管理企业客户档案和分析记录</p>
        </div>
        <Link href="/customers/new" className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          ➕ 新建客户
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="搜索客户名称、行业..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">企业名称</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">行业</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">风险评级</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">创建时间</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <Link href={`/customers/${c.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {c.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-gray-600">{c.industry}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    c.risk_rating === 'A' ? 'bg-green-100 text-green-700' :
                    c.risk_rating === 'B' ? 'bg-blue-100 text-blue-700' :
                    c.risk_rating === 'C' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {c.risk_rating}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{c.created_at}</td>
                <td className="px-6 py-4">
                  <Link href={`/customers/${c.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                    查看详情 →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayCustomers.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <p className="text-4xl mb-3">📋</p>
            <p>暂无客户数据</p>
            <Link href="/customers/new" className="text-blue-600 hover:underline mt-2 inline-block">
              立即新建 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
