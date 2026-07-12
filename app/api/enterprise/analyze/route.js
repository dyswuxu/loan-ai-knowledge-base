/**
 * 企业综合分析 API
 * 一次性完成：分类 + 产品匹配 + 风控分析
 */
const { classifyEnterprise, matchProducts, analyzeRisk } = require('../../../../lib/enterprise');
const { searchProducts } = require('../../../../lib/rag');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { enterprise } = req.body;
    
    if (!enterprise) {
      return res.status(400).json({ error: 'Enterprise data is required' });
    }

    console.log('🚀 Starting comprehensive analysis for enterprise:', enterprise.name || 'Anonymous');

    // Step 1: 企业分类
    console.log('📊 Step 1: Classifying enterprise...');
    const classification = await classifyEnterprise(enterprise);
    console.log('✅ Classification done:', classification);

    // Step 2: 产品匹配
    console.log('📊 Step 2: Matching products...');
    const searchQuery = buildSearchQuery(enterprise, classification);
    const topProducts = await searchProducts(searchQuery, 10);
    const matchResult = await matchProducts(enterprise, classification, topProducts);
    console.log('✅ Product matching done');

    // Step 3: 风控分析
    console.log('📊 Step 3: Analyzing risk...');
    const riskAnalysis = await analyzeRisk(enterprise, classification);
    console.log('✅ Risk analysis done');

    const result = {
      enterprise_profile: {
        name: enterprise.name || '未提供',
        industry: enterprise.industry || '未提供',
        scale: enterprise.scale || '未提供',
        annual_revenue: enterprise.annualRevenue || '未提供',
        years_established: enterprise.yearsEstablished || '未提供',
        has_property: enterprise.hasProperty || false,
        annual_tax: enterprise.annualTax || '未提供',
        bank_flow: enterprise.bankFlow || '未提供',
        credit_rating: enterprise.creditRating || '未提供',
        loan_purpose: enterprise.loanPurpose || '未提供'
      },
      classification,
      product_recommendations: matchResult,
      risk_analysis: riskAnalysis
    };

    console.log('🎉 Analysis complete!');
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Analysis failed',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

function buildSearchQuery(enterprise, classification) {
  const parts = [];
  
  if (classification?.推荐需求类型) {
    parts.push(classification.推荐需求类型.join(' '));
  }
  
  if (classification?.资产情况) {
    parts.push(classification.资产情况);
  }
  
  if (enterprise.industry) {
    parts.push(enterprise.industry);
  }
  
  if (enterprise.loanPurpose) {
    parts.push(enterprise.loanPurpose);
  }
  
  return parts.join(' ');
}
