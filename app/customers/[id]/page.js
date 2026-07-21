'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CustomerDetailPage() {
  const params = useParams();
  const [customer, setCustomer] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Mock customer data - in production this would be fetched from API
  const mockCustomer = {
    id: params.id,
    name: '上海XX贸易有限公司',
    industry: '商贸',
    scale: '小型',
    annualRevenue: '800',
    yearsEstablished: '5',
    hasProperty: true,
    annualTax: '24',
    bankFlow: '一般',
    creditRating: 'B',
    loanPurpose: '流动资金周转',
    status: 'active',
    created_at: '2026-07-14',
    contacts: [
      { name: '张总', phone: '138****1234', position: '总经理' }
    ]
  };

  const mockAnalysis = {
    classification: {
      '规模标签': '小型',
      '经营年限标签': '成熟',
      '财务表现': '良好',
      '资产情况': '有抵押物',
      '纳税等级': 'B级',
      '推荐需求类型': ['周转性贷款', '流动资金贷款'],
      '简要说明': '该企业为商贸行业小型企业，成立5年，经营稳定，年营业额800万，财务表现良好。有房产抵押，纳税记录正常，具备申请流动资金贷款的条件。建议优先考虑抵押类贷款产品，额度可覆盖年营业额的30-50%。'
    },
    product_recommendations: {
      recommended_products: [
        { bank: '工商银行', product_name: '小微企业流动资金贷款', match_score: 92, match_reasons: ['有房产抵押，匹配抵押贷条件', '年营业额800万，符合额度要求', '企业经营稳定，风险可控'], warnings: [] },
        { bank: '建设银行', product_name: '商贸通贷款', match_score: 85, match_reasons: ['商贸行业专属产品', '支持流动资金周转', '审批效率高'], warnings: ['信用评级B级，利率可能偏高'] },
        { bank: '农业银行', product_name: '惠农e贷', match_score: 78, match_reasons: ['支持小微企业', '线上审批速度快'], warnings: ['行业适配度一般'] }
      ],
      match_summary: '综合评估：该企业匹配度较高，建议优先联系工商银行和建设银行产品。'
    },
    risk_analysis: {
      risk_score: 35,
      risk_level: '低',
      risk_factors: [
        { factor: '经营年限充足', level: '低', suggestion: '5年经营年限降低经营风险' },
        { factor: '有房产抵押', level: '低', suggestion: '抵押物充足，风险可控' },
        { factor: '纳税记录正常', level: '低', suggestion: '税务合规，财务真实性较高' }
      ],
      recommended_amount_range: '240-400万元',
      improvement_suggestions: ['保持良好银行流水记录', '提升企业信用评级至A级可获得更低利率']
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCustomer(mockCustomer);
      setAnalysis(mockAnalysis);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setAnalysis(mockAnalysis);
    setAnalyzing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">加载中...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">客户不存在</p>
        <Link href="/customers" className="text-blue-400 hover:underline mt-2 inline-block">返回客户列表</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/customers" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">← 返回客户列表</Link>
          <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs">{customer.industry}</span>
            <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-xs">规模：{customer.scale}</span>
            <span className="text-slate-500 text-sm">创建于 {customer.created_at}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
            ✏️ 编辑
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {analyzing ? '分析中...' : '🔄 重新分析'}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="col-span-1 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm font-medium text-slate-400 mb-4">企业基本信息</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">行业</span>
                <span className="text-white">{customer.industry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">年营业额</span>
                <span className="text-white">{customer.annualRevenue}万</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">成立年限</span>
                <span className="text-white">{customer.yearsEstablished}年</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">抵押物</span>
                <span className={customer.hasProperty ? 'text-green-400' : 'text-slate-400'}>
                  {customer.hasProperty ? '✓ 有房产' : '无'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">年纳税额</span>
                <span className="text-white">{customer.annualTax}万</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">银行流水</span>
                <span className="text-white">{customer.bankFlow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">信用评级</span>
                <span className="text-white">{customer.creditRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">贷款用途</span>
                <span className="text-white">{customer.loanPurpose}</span>
              </div>
            </div>
          </div>

          {/* Risk Assessment Card */}
          {analysis?.risk_analysis && (
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-4">风控评估</h3>
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                  analysis.risk_analysis.risk_level === '低' ? 'bg-green-900' :
                  analysis.risk_analysis.risk_level === '中' ? 'bg-yellow-900' : 'bg-red-900'
                }`}>
                  <span className={`text-2xl font-bold ${
                    analysis.risk_analysis.risk_level === '低' ? 'text-green-400' :
                    analysis.risk_analysis.risk_level === '中' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {analysis.risk_analysis.risk_score}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${
                  analysis.risk_analysis.risk_level === '低' ? 'text-green-400' :
                  analysis.risk_analysis.risk_level === '中' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  风险{analysis.risk_analysis.risk_level}（分数越低越好）
                </p>
              </div>
              <div className="space-y-2">
                {analysis.risk_analysis.risk_factors?.map((factor, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${
                      factor.level === '低' ? 'bg-green-400' :
                      factor.level === '中' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></span>
                    <div>
                      <span className="text-slate-300">{factor.factor}</span>
                      <p className="text-slate-500 text-xs">{factor.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-500">建议贷款额度</p>
                <p className="text-lg font-medium text-white">{analysis.risk_analysis.recommended_amount_range}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Analysis Results */}
        <div className="col-span-2 space-y-6">
          {/* Classification Card */}
          {analysis?.classification && (
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-4">企业画像分析</h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-500">规模</p>
                  <p className="font-medium text-white">{analysis.classification['规模标签']}</p>
                </div>
                <div className="text-center p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-500">经营年限</p>
                  <p className="font-medium text-white">{analysis.classification['经营年限标签']}</p>
                </div>
                <div className="text-center p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-500">财务表现</p>
                  <p className="font-medium text-white">{analysis.classification['财务表现']}</p>
                </div>
                <div className="text-center p-3 bg-slate-900 rounded-lg">
                  <p className="text-xs text-slate-500">资产情况</p>
                  <p className="font-medium text-white">{analysis.classification['资产情况']}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">推荐需求类型</p>
                <div className="flex gap-2">
                  {analysis.classification['推荐需求类型']?.map((type, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs">{type}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">AI 分析说明</p>
                <p className="text-sm text-slate-300">{analysis.classification['简要说明']}</p>
              </div>
            </div>
          )}

          {/* Products Card */}
          {analysis?.product_recommendations && (
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-4">推荐产品</h3>
              <div className="space-y-4">
                {analysis.product_recommendations.recommended_products?.map((product, i) => (
                  <div key={i} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white">{product.bank} - {product.product_name}</h4>
                        <div className="flex gap-2 mt-1">
                          {product.match_reasons?.slice(0, 2).map((reason, j) => (
                            <span key={j} className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{reason}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          product.match_score >= 90 ? 'bg-green-900 text-green-300' :
                          product.match_score >= 80 ? 'bg-blue-900 text-blue-300' :
                          'bg-yellow-900 text-yellow-300'
                        }`}>
                          {product.match_score}%
                        </span>
                      </div>
                    </div>
                    {product.warnings?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {product.warnings?.map((warning, j) => (
                          <span key={j} className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded">⚠️ {warning}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {analysis.product_recommendations.match_summary && (
                <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-300">{analysis.product_recommendations.match_summary}</p>
                </div>
              )}
            </div>
          )}

          {/* Improvement Suggestions */}
          {analysis?.risk_analysis?.improvement_suggestions?.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-medium text-slate-400 mb-4">📝 改进建议</h3>
              <ul className="space-y-2">
                {analysis.risk_analysis.improvement_suggestions?.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-400">•</span>
                    <span className="text-slate-300">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
