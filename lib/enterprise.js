/**
 * 企业画像与分类模块
 */
const { chatCompletion } = require('./minimax');

/**
 * 企业画像分类
 */
async function classifyEnterprise(enterpriseData) {
  const prompt = `
你是一位专业的企业贷款顾问。根据以下企业信息，对企业进行分类并推荐合适的贷款需求类型。

## 企业信息
- 企业名称: ${enterpriseData.name || '未提供'}
- 所在行业: ${enterpriseData.industry || '未提供'}
- 企业规模: ${enterpriseData.scale || '未提供'}
- 年营业额: ${enterpriseData.annualRevenue || '未提供'} 万元
- 成立年限: ${enterpriseData.yearsEstablished || '未提供'} 年
- 是否有房产抵押: ${enterpriseData.hasProperty ? '有' : '无'}
- 年纳税额: ${enterpriseData.annualTax || '未提供'} 万元
- 银行流水情况: ${enterpriseData.bankFlow || '未提供'}
- 企业信用评级: ${enterpriseData.creditRating || '未提供'}
- 贷款用途: ${enterpriseData.loanPurpose || '未提供'}

## 企业资质标签
请从以下维度输出分类结果：
- 规模标签: 小微/小型/中型/大型
- 经营年限标签: 新设(<1年)/成长(1-3年)/成熟(3年+)
- 财务表现: 优质/良好/一般/较弱
- 资产情况: 有抵押物/纯信用
- 纳税等级: A级/B级/C级/D级/无纳税记录/未知

## 贷款需求类型
请根据企业信息判断其贷款需求类型（可多选，最多2个）：
- 周转性贷款: 日常经营周转，如流动资金贷款、透支
- 投资性贷款: 扩大生产/项目投资，如固定资产贷款、项目融资、并购贷款
- 供应链融资: 核心企业上下游，如保理、订单融资、仓单融资
- 政策支持类: 特定政策支持，如科技贷、创业贷、人才贷
- 票据融资: 票据结算相关，如银承贴现、商承贴现、国内信用证

## 输出格式
请以JSON格式输出，字段如下：
{
  "规模标签": "...",
  "经营年限标签": "...",
  "财务表现": "...",
  "资产情况": "...",
  "纳税等级": "...",
  "推荐需求类型": ["...", "..."],
  "简要说明": "..."
}
`;

  const result = await chatCompletion([
    { role: 'user', content: prompt }
  ], 'MiniMax-Text-01', 0.3);

  try {
    // 尝试解析JSON
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    // 如果无法解析，返回结构化结果
    return {
      规模标签: '小型',
      经营年限标签: '成熟',
      财务表现: '一般',
      资产情况: enterpriseData.hasProperty ? '有抵押物' : '纯信用',
      纳税等级: '未知',
      推荐需求类型: ['周转性贷款'],
      简要说明: result
    };
  } catch (e) {
    return {
      规模标签: '小型',
      经营年限标签: '成熟',
      财务表现: '一般',
      资产情况: enterpriseData.hasProperty ? '有抵押物' : '纯信用',
      纳税等级: '未知',
      推荐需求类型: ['周转性贷款'],
      简要说明: result
    };
  }
}

/**
 * 产品匹配
 */
async function matchProducts(enterpriseData, classification, topProducts) {
  const prompt = `
你是一位专业的贷款顾问。基于以下企业画像和初步匹配的产品，进行深度分析，给出最终推荐。

## 企业画像
- 规模标签: ${classification.规模标签}
- 经营年限标签: ${classification.经营年限标签}
- 财务表现: ${classification.财务表现}
- 资产情况: ${classification.资产情况}
- 纳税等级: ${classification.纳税等级}
- 推荐需求类型: ${classification.推荐需求类型?.join(', ')}

## 企业原始信息
- 年营业额: ${enterpriseData.annualRevenue || '未提供'} 万元
- 成立年限: ${enterpriseData.yearsEstablished || '未提供'} 年
- 贷款用途: ${enterpriseData.loanPurpose || '未提供'}

## 初步匹配的产品（按相关性排序）
${topProducts.slice(0, 5).map((p, i) => `
${i + 1}. ${p.bank} - ${p.product_name}
   利率: ${p.interest_rate}
   额度: ${p.loan_amount}
   担保方式: ${p.guarantee_method}
   经营年限要求: ${p.operation_years}
   资产负债率要求: ${p.asset_liability_ratio}
   信用评级要求: ${p.credit_rating}
`).join('\n')}

## 分析要求
1. 检查每个产品是否真正满足该企业的硬性准入条件
2. 考虑利率最优、额度匹配
3. 输出最终推荐的3-5个产品及理由

## 输出格式
请以JSON格式输出：
{
  "recommended_products": [
    {
      "bank": "...",
      "product_name": "...",
      "match_score": 0-100,
      "match_reasons": ["...", "..."],
      "warnings": ["..."]
    }
  ],
  "match_summary": "总体匹配情况说明"
}
`;

  const result = await chatCompletion([
    { role: 'user', content: prompt }
  ], 'MiniMax-Text-01', 0.3);

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { recommended_products: topProducts.slice(0, 3), match_summary: result };
  } catch (e) {
    return { recommended_products: topProducts.slice(0, 3), match_summary: result };
  }
}

/**
 * 风控分析
 */
async function analyzeRisk(enterpriseData, classification) {
  const prompt = `
你是一位资深风控分析师。基于以下企业信息，分析其贷款风险点。

## 企业信息
- 年营业额: ${enterpriseData.annualRevenue || '未提供'} 万元
- 成立年限: ${enterpriseData.yearsEstablished || '未提供'} 年
- 是否有房产抵押: ${enterpriseData.hasProperty ? '有' : '无'}
- 年纳税额: ${enterpriseData.annualTax || '未提供'} 万元
- 银行流水情况: ${enterpriseData.bankFlow || '未提供'}
- 企业信用评级: ${enterpriseData.creditRating || '未提供'}
- 贷款用途: ${enterpriseData.loanPurpose || '未提供'}

## 企业分类
- 规模标签: ${classification?.规模标签 || '未知'}
- 经营年限标签: ${classification?.经营年限标签 || '未知'}
- 财务表现: ${classification?.财务表现 || '未知'}
- 资产情况: ${classification?.资产情况 || '未知'}
- 纳税等级: ${classification?.纳税等级 || '未知'}

## 分析要求
1. 识别关键风险因素（行业风险、经营风险、财务风险、信用风险）
2. 评估风险等级（高/中/低）
3. 给出改进建议

## 输出格式
请以JSON格式输出：
{
  "risk_score": 0-100（越低越好）,
  "risk_level": "高/中/低",
  "risk_factors": [
    {
      "factor": "风险因素描述",
      "level": "高/中/低",
      "suggestion": "建议如何改善"
    }
  ],
  "recommended_amount_range": "建议贷款额度区间",
  "improvement_suggestions": ["改善建议1", "改善建议2"]
}
`;

  const result = await chatCompletion([
    { role: 'user', content: prompt }
  ], 'MiniMax-Text-01', 0.3);

  try {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {
      risk_score: 50,
      risk_level: '中',
      risk_factors: [{ factor: '信息有限', level: '中', suggestion: '建议补充更多企业信息' }],
      recommended_amount_range: '待评估',
      improvement_suggestions: ['补充完整企业信息可获得更准确的风控分析']
    };
  } catch (e) {
    return {
      risk_score: 50,
      risk_level: '中',
      risk_factors: [{ factor: '分析异常', level: '中', suggestion: '请稍后重试' }],
      recommended_amount_range: '待评估',
      improvement_suggestions: ['请稍后重试']
    };
  }
}

module.exports = {
  classifyEnterprise,
  matchProducts,
  analyzeRisk
};
