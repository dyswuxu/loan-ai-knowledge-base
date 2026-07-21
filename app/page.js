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
    { label: '客户总数', value: '0', icon: '👥', color: 'bg-blue-600' },
    { label: '产品数量', value: '195', icon: '📦', color: 'bg-green-600' },
    { label: '今日分析', value: '0', icon: '📊', color: 'bg-purple-600' },
    { label: '待跟进潜客', value: '0', icon: '🎯', color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">工作台</h1>
        <p className="text-slate-400 mt-1">欢迎使用贷款AI知识库系统</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className={`${s.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-400">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/customers/new" className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
          <div className="text-3xl mb-3">➕</div>
          <h3 className="font-semibold text-white group-hover:text-blue-400">新建客户档案</h3>
          <p className="text-sm text-slate-400 mt-1">录入企业信息，开始分析</p>
        </Link>

        <Link href="/products" className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
          <div className="text-3xl mb-3">📦</div>
          <h3 className="font-semibold text-white group-hover:text-blue-400">浏览产品库</h3>
          <p className="text-sm text-slate-400 mt-1">查看195个银行贷款产品</p>
        </Link>

        <Link href="/chat" className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-colors group">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-white group-hover:text-blue-400">AI 对话</h3>
          <p className="text-sm text-slate-400 mt-1">自然语言查询产品和客户</p>
        </Link>
      </div>

      {/* Quick Analyze Form */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">⚡ 快速分析</h2>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">企业名称</label>
              <input name="name" value={quickForm.name} onChange={handleChange} placeholder="（脱敏）" className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">行业</label>
              <select name="industry" value={quickForm.industry} onChange={handleChange} className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
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
              <label className="block text-sm font-medium text-slate-300 mb-1">年营业额(万)</label>
              <input name="annualRevenue" type="number" value={quickForm.annualRevenue} onChange={handleChange} placeholder="500" className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">成立年限</label>
              <input name="yearsEstablished" type="number" value={quickForm.yearsEstablished} onChange={handleChange} placeholder="3" className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                <input name="hasCollateral" type="checkbox" checked={quickForm.hasCollateral} onChange={handleChange} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">有抵押物</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? '分析中...' : '🔍 开始分析'}
            </button>
            <Link href="/customers/new" className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
              完整建档 →
            </Link>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400">企业分类</p>
                <p className="font-medium text-white">{result.classification?.规模标签 || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">风险等级</p>
                <p className={`font-medium ${
                  result.risk_analysis?.risk_level === '高' ? 'text-red-400' :
                  result.risk_analysis?.risk_level === '中' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  {result.risk_analysis?.risk_score || '-'} ({result.risk_analysis?.risk_level || '-'})
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">推荐产品</p>
                <p className="font-medium text-white">{result.product_recommendations?.recommended_products?.length || 0} 个</p>
              </div>
            </div>
            {result.product_recommendations?.recommended_products?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm font-medium mb-2 text-slate-300">推荐产品 TOP 3：</p>
                <div className="space-y-2">
                  {result.product_recommendations.recommended_products.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded border border-slate-700">
                      <span className="text-sm text-white">{p.bank} - {p.product_name}</span>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">匹配度 {p.match_score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.classification?.简要说明 && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400 mb-1">AI 分析说明</p>
                <p className="text-sm text-slate-300">{result.classification.简要说明}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
