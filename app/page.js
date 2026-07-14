'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [quickForm, setQuickForm] = useState({
    name: '',
    industry: '',
    annualRevenue: '',
    yearsEstablished: '',
    hasCollateral: false,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setQuickForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/enterprise/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enterprise: quickForm }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: '客户总数', value: '0', icon: '👥', color: 'bg-blue-500' },
    { label: '产品数量', value: '195', icon: '📦', color: 'bg-green-500' },
    { label: '今日分析', value: '0', icon: '📊', color: 'bg-purple-500' },
    { label: '待跟进潜客', value: '0', icon: '🎯', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
        <p className="text-gray-500 mt-1">欢迎使用贷款AI知识库系统</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`${s.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/customers/new" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-3">➕</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">新建客户档案</h3>
          <p className="text-sm text-gray-500 mt-1">录入企业信息，开始分析</p>
        </Link>

        <Link href="/products" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-3">📦</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">浏览产品库</h3>
          <p className="text-sm text-gray-500 mt-1">查看195个银行贷款产品</p>
        </Link>

        <Link href="/chat" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">AI 对话</h3>
          <p className="text-sm text-gray-500 mt-1">自然语言查询产品和客户</p>
        </Link>
      </div>

      {/* Quick Analyze Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ 快速分析</h2>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">企业名称</label>
              <input name="name" value={quickForm.name} onChange={handleChange} placeholder="（脱敏）" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">行业</label>
              <select name="industry" value={quickForm.industry} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">请选择</option>
                <option value="制造业">制造业</option>
                <option value="商贸">商贸</option>
                <option value="科技">科技</option>
                <option value="服务业">服务业</option>
                <option value="建筑">建筑</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年营业额(万)</label>
              <input name="annualRevenue" type="number" value={quickForm.annualRevenue} onChange={handleChange} placeholder="500" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">成立年限</label>
              <input name="yearsEstablished" type="number" value={quickForm.yearsEstablished} onChange={handleChange} placeholder="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 px-4 py-2">
                <input name="hasCollateral" type="checkbox" checked={quickForm.hasCollateral} onChange={handleChange} className="w-4 h-4 rounded" />
                <span className="text-sm">有抵押物</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? '分析中...' : '🔍 开始分析'}
            </button>
            <Link href="/customers/new" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              完整建档 →
            </Link>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">企业分类</p>
                <p className="font-medium">{result.classification?.规模标签 || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">风险等级</p>
                <p className={`font-medium ${
                  result.risk_analysis?.risk_level === '高' ? 'text-red-600' :
                  result.risk_analysis?.risk_level === '中' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {result.risk_analysis?.risk_score || '-'} ({result.risk_analysis?.risk_level || '-'})
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">推荐产品</p>
                <p className="font-medium">{result.product_recommendations?.recommended_products?.length || 0} 个</p>
              </div>
            </div>
            {result.product_recommendations?.recommended_products?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-medium mb-2">推荐产品 TOP 3：</p>
                <div className="space-y-2">
                  {result.product_recommendations.recommended_products.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-white px-3 py-2 rounded">
                      <span className="text-sm">{p.bank} - {p.product_name}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">匹配度 {p.match_score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
