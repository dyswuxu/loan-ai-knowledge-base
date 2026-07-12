'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    scale: '小型',
    annualRevenue: '',
    yearsEstablished: '',
    hasProperty: false,
    annualTax: '',
    bankFlow: '一般',
    creditRating: '未知',
    loanPurpose: ''
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/enterprise/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enterprise: formData })
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || '分析失败');
      }
    } catch (err) {
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏦 贷款AI知识库系统
          </h1>
          <p className="text-gray-600">
            输入企业信息，获取智能贷款产品推荐和风控分析
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📋 企业信息录入
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企业名称
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="（脱敏处理）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    所在行业
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="制造业">制造业</option>
                    <option value="服务业">服务业</option>
                    <option value="贸易">贸易</option>
                    <option value="科技">科技</option>
                    <option value="建筑">建筑</option>
                    <option value="农业">农业</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企业规模
                  </label>
                  <select
                    name="scale"
                    value={formData.scale}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="小微">小微</option>
                    <option value="小型">小型</option>
                    <option value="中型">中型</option>
                    <option value="大型">大型</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年营业额（万元）
                  </label>
                  <input
                    type="number"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleChange}
                    placeholder="如：500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    成立年限（年）
                  </label>
                  <input
                    type="number"
                    name="yearsEstablished"
                    value={formData.yearsEstablished}
                    onChange={handleChange}
                    placeholder="如：3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年纳税额（万元）
                  </label>
                  <input
                    type="number"
                    name="annualTax"
                    value={formData.annualTax}
                    onChange={handleChange}
                    placeholder="如：20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    银行流水情况
                  </label>
                  <select
                    name="bankFlow"
                    value={formData.bankFlow}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="优质">优质</option>
                    <option value="良好">良好</option>
                    <option value="一般">一般</option>
                    <option value="较差">较差</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    企业信用评级
                  </label>
                  <select
                    name="creditRating"
                    value={formData.creditRating}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="未知">未知</option>
                    <option value="AAA">AAA</option>
                    <option value="AA">AA</option>
                    <option value="A">A</option>
                    <option value="BBB">BBB</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="hasProperty"
                    checked={formData.hasProperty}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    是否有房产抵押
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  贷款用途
                </label>
                <textarea
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={handleChange}
                  rows={2}
                  placeholder="如：扩大经营规模、采购设备"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                {loading ? '分析中...' : '🔍 开始分析'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">❌ {error}</p>
              </div>
            )}

            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-blue-800">正在分析企业信息...</p>
              </div>
            )}

            {result && (
              <>
                {/* Enterprise Profile */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    📊 企业画像
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">规模标签</div>
                      <div className="font-medium">{result.classification?.规模标签 || '-'}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">经营年限</div>
                      <div className="font-medium">{result.classification?.经营年限标签 || '-'}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">财务表现</div>
                      <div className="font-medium">{result.classification?.财务表现 || '-'}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">资产情况</div>
                      <div className="font-medium">{result.classification?.资产情况 || '-'}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">纳税等级</div>
                      <div className="font-medium">{result.classification?.纳税等级 || '-'}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="text-sm text-gray-500">推荐需求</div>
                      <div className="font-medium">{result.classification?.推荐需求类型?.join(', ') || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Risk Analysis */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    ⚠️ 风控分析
                  </h2>
                  {result.risk_analysis && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">风险评分</span>
                        <span className={`font-bold text-lg ${
                          result.risk_analysis.risk_level === '高' ? 'text-red-600' :
                          result.risk_analysis.risk_level === '中' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {result.risk_analysis.risk_score} ({result.risk_analysis.risk_level})
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        建议贷款额度：{result.risk_analysis.recommended_amount_range}
                      </div>
                      {result.risk_analysis.risk_factors?.length > 0 && (
                        <div className="space-y-2">
                          <div className="font-medium text-gray-700">风险因素：</div>
                          {result.risk_analysis.risk_factors.map((factor, idx) => (
                            <div key={idx} className="bg-gray-50 rounded p-3 text-sm">
                              <span className={`font-medium ${
                                factor.level === '高' ? 'text-red-600' :
                                factor.level === '中' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                [{factor.level}]
                              </span>
                              {' '}{factor.factor}
                              {factor.suggestion && (
                                <div className="text-gray-500 mt-1">→ {factor.suggestion}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Product Recommendations */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    💡 推荐产品
                  </h2>
                  {result.product_recommendations?.recommended_products?.length > 0 ? (
                    <div className="space-y-4">
                      {result.product_recommendations.recommended_products.map((product, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium text-gray-900">
                                {product.bank} - {product.product_name}
                              </span>
                            </div>
                            <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                              匹配度 {product.match_score}%
                            </span>
                          </div>
                          {product.match_reasons?.length > 0 && (
                            <div className="text-sm text-gray-600 mb-2">
                              匹配理由：{product.match_reasons.join('；')}
                            </div>
                          )}
                          {product.warnings?.length > 0 && (
                            <div className="text-sm text-yellow-600">
                              ⚠️ {product.warnings.join('；')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">暂未找到合适的推荐产品</p>
                  )}
                </div>
              </>
            )}

            {!result && !loading && !error && (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  👈 请在左侧填写企业信息，点击"开始分析"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
