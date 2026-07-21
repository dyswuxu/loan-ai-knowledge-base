'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCustomerPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    credit_code: '',
    industry: '',
    established_year: '',
    employee_count: '',
    annual_revenue: '',
    tax_amount: '',
    has_collateral: false,
    collateral_type: [],
    notes: '',
  });
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    // TODO: Upload to OSS + parse
    setTimeout(() => {
      setDocuments(prev => [...prev, { type, name: file.name, status: 'done' }]);
      setUploading(false);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Save to DB
    setTimeout(() => {
      setSaving(false);
      router.push('/customers');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/customers" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">← 返回客户列表</Link>
        <h1 className="text-2xl font-bold text-white">新建客户档案</h1>
        <p className="text-slate-400 mt-1">录入企业信息并上传证件，AI自动解析</p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
              step >= s ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'
            }`}>{s}</div>
            <span className={`text-sm ${step >= s ? 'text-white' : 'text-slate-500'}`}>
              {s === 1 ? '基本信息' : s === 2 ? '上传证件' : '确认提交'}
            </span>
            {s < 3 && <div className="w-12 h-px bg-slate-700" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
            <h2 className="text-lg font-semibold text-white">📋 企业基本信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">企业名称 *</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">统一社会信用代码</label>
                <input name="credit_code" value={formData.credit_code} onChange={handleChange} className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">所属行业 *</label>
                <select name="industry" value={formData.industry} onChange={handleChange} required className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">请选择</option>
                  <option value="制造业">制造业</option>
                  <option value="商贸">商贸</option>
                  <option value="科技">科技</option>
                  <option value="服务业">服务业</option>
                  <option value="建筑">建筑</option>
                  <option value="农业">农业</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">成立年份</label>
                <input name="established_year" type="number" value={formData.established_year} onChange={handleChange} placeholder="2015" className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">员工规模</label>
                <select name="employee_count" value={formData.employee_count} onChange={handleChange} className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">请选择</option>
                  <option value="10人以下">10人以下</option>
                  <option value="10-50人">10-50人</option>
                  <option value="50-100人">50-100人</option>
                  <option value="100人以上">100人以上</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">年营业额(万元)</label>
                <input name="annual_revenue" type="number" value={formData.annual_revenue} onChange={handleChange} placeholder="500" className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">年纳税额(万元)</label>
                <input name="tax_amount" type="number" value={formData.tax_amount} onChange={handleChange} placeholder="20" className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 px-4 py-2 cursor-pointer">
                  <input name="has_collateral" type="checkbox" checked={formData.has_collateral} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm text-slate-300">有抵押物（房产/设备）</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">备注</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-slate-600 bg-slate-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setStep(2)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {step === 2 && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
            <h2 className="text-lg font-semibold text-white">📎 上传证件材料</h2>
            <p className="text-sm text-slate-400">上传营业执照、财务报表、银行流水等，AI自动解析提取关键信息</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { type: 'business_license', label: '营业执照', desc: '企业名称、注册资本、经营范围' },
                { type: 'financial', label: '财务报表', desc: '营收、利润、资产负债' },
                { type: 'bank_flow', label: '银行流水', desc: '月均流水、收入稳定性' },
                { type: 'property', label: '房产证', desc: '房产估值、抵押情况' },
              ].map((doc) => {
                const uploaded = documents.find(d => d.type === doc.type);
                return (
                  <div key={doc.type} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-white">{doc.label}</p>
                        <p className="text-xs text-slate-400">{doc.desc}</p>
                      </div>
                      {uploaded && <span className="text-green-400 text-sm">✓ 已上传</span>}
                    </div>
                    <label className="block cursor-pointer">
                      <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileUpload(e, doc.type)} className="hidden" />
                      <span className="inline-block px-4 py-2 border border-slate-600 rounded-lg text-sm text-slate-300 hover:bg-slate-700 transition-colors">
                        {uploading ? '上传中...' : uploaded ? '重新上传' : '选择文件'}
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="bg-slate-900 rounded-lg p-4 text-sm text-slate-400 border border-slate-700">
              💡 提示：AI将自动解析文档内容，您可以在下一步确认解析结果
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(1)} className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                ← 上一步
              </button>
              <button type="button" onClick={() => setStep(3)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                下一步 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
            <h2 className="text-lg font-semibold text-white">✅ 确认信息</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-slate-500">企业名称</p>
                  <p className="font-medium text-white">{formData.name || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">所属行业</p>
                  <p className="font-medium text-white">{formData.industry || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">年营业额</p>
                  <p className="font-medium text-white">{formData.annual_revenue ? `${formData.annual_revenue} 万元` : '-'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-500">成立年份</p>
                  <p className="font-medium text-white">{formData.established_year || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">年纳税额</p>
                  <p className="font-medium text-white">{formData.tax_amount ? `${formData.tax_amount} 万元` : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-500">抵押物</p>
                  <p className="font-medium text-white">{formData.has_collateral ? '有' : '无'}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-4">
              <p className="text-slate-500 text-sm mb-2">已上传文档</p>
              <div className="flex gap-2 flex-wrap">
                {documents.map((d) => (
                  <span key={d.type} className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm">
                    ✓ {d.label || d.type}
                  </span>
                ))}
                {documents.length === 0 && <span className="text-slate-500 text-sm">暂无</span>}
              </div>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={() => setStep(2)} className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                ← 上一步
              </button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                {saving ? '保存中...' : '💾 保存并分析'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
