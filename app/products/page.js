'use client';

import { useState, useEffect } from 'react';

const mockProducts = [
  { id: '1', bank: '工商银行', product_name: '小微企业快贷', loan_type: '信用贷', max_amount: 3000000, min_rate: 4.35, max_rate: 7.2, collateral: '信用', target: '小微企业', requirements: ['经营满1年', '有流水'], status: 'active' },
  { id: '2', bank: '建设银行', product_name: '抵押快贷', loan_type: '抵押贷', max_amount: 10000000, min_rate: 3.85, max_rate: 5.5, collateral: '房产抵押', target: '有房产企业', requirements: ['有房产抵押', '经营满2年'], status: 'active' },
  { id: '3', bank: '农业银行', product_name: '惠农e贷', loan_type: '信用贷', max_amount: 1000000, min_rate: 4.0, max_rate: 6.0, collateral: '信用', target: '农业经营主体', requirements: ['农业相关行业'], status: 'active' },
  { id: '4', bank: '中国银行', product_name: '中小企业贷款', loan_type: '流贷', max_amount: 5000000, min_rate: 3.9, max_rate: 6.5, collateral: '抵押/信用', target: '中小企业', requirements: ['经营满2年', '纳税记录'], status: 'active' },
  { id: '5', bank: '招商银行', product_name: '招贷宝', loan_type: '信用贷', max_amount: 2000000, min_rate: 5.0, max_rate: 8.0, collateral: '信用', target: '小微企业/个体工商户', requirements: ['经营满1年'], status: 'active' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bankFilter, setBankFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // TODO: Fetch from API
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 500);
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = !search || p.product_name.includes(search) || p.bank.includes(search) || p.target.includes(search);
    const matchBank = !bankFilter || p.bank === bankFilter;
    const matchType = !typeFilter || p.loan_type === typeFilter;
    return matchSearch && matchBank && matchType;
  });

  const banks = [...new Set(mockProducts.map(p => p.bank))];
  const types = [...new Set(mockProducts.map(p => p.loan_type))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">产品知识库</h1>
        <p className="text-slate-400 mt-1">浏览和搜索银行贷款产品</p>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex gap-4">
        <input
          type="text"
          placeholder="搜索产品名称、银行、目标客群..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select 
          value={bankFilter} 
          onChange={(e) => setBankFilter(e.target.value)} 
          className="px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">全部银行</option>
          {banks.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)} 
          className="px-4 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">全部类型</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">加载中...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((p) => (
            <div 
              key={p.id} 
              className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setSelectedProduct(p)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{p.bank} - {p.product_name}</h3>
                  <span className="text-xs text-slate-400">{p.loan_type}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  p.collateral === '信用' ? 'bg-green-900 text-green-300' : 'bg-blue-900 text-blue-300'
                }`}>
                  {p.collateral}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                <div className="bg-slate-900 rounded p-2">
                  <p className="text-slate-500 text-xs">额度</p>
                  <p className="font-medium text-white">{p.max_amount >= 10000000 ? '1000万+' : `${p.max_amount / 10000}万`}</p>
                </div>
                <div className="bg-slate-900 rounded p-2">
                  <p className="text-slate-500 text-xs">利率</p>
                  <p className="font-medium text-white">{p.min_rate}-{p.max_rate}%</p>
                </div>
                <div className="bg-slate-900 rounded p-2">
                  <p className="text-slate-500 text-xs">目标</p>
                  <p className="font-medium text-white text-xs">{p.target.slice(0, 6)}</p>
                </div>
              </div>
              {p.requirements && (
                <div className="flex flex-wrap gap-1">
                  {p.requirements.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">{r}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-500 bg-slate-800 rounded-xl border border-slate-700">
          <p className="text-4xl mb-3">📦</p>
          <p>未找到匹配的产品</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedProduct(null)}>
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg mx-4 border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedProduct.bank}</h3>
                <p className="text-lg text-slate-300">{selectedProduct.product_name}</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">贷款类型</p>
                <p className="font-medium text-white">{selectedProduct.loan_type}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">担保方式</p>
                <p className="font-medium text-white">{selectedProduct.collateral}</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">额度范围</p>
                <p className="font-medium text-white">{selectedProduct.min_amount / 10000}万 - {selectedProduct.max_amount / 10000}万</p>
              </div>
              <div className="bg-slate-900 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">利率范围</p>
                <p className="font-medium text-white">{selectedProduct.min_rate}% - {selectedProduct.max_rate}%</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-300 mb-2">准入条件</p>
              <div className="space-y-1">
                {selectedProduct.requirements?.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="text-green-400">✓</span> {r}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-900/50 border border-blue-800 rounded-lg p-3 text-sm text-blue-300">
              💡 目标客群：{selectedProduct.target}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
