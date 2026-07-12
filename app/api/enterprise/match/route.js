/**
 * 产品匹配 API
 */
const { matchProducts } = require('../../../../../lib/enterprise');
const { searchProducts } = require('../../../../../lib/rag');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { enterprise, classification, query } = req.body;
    
    if (!enterprise || !classification) {
      return res.status(400).json({ error: 'Enterprise and classification data are required' });
    }

    console.log('🔍 Matching products for enterprise:', enterprise.name || 'Anonymous');
    console.log('   Classification:', classification);

    // 构建查询文本
    const searchQuery = query || buildSearchQuery(enterprise, classification);
    
    // 搜索相关产品
    const topProducts = await searchProducts(searchQuery, 10);
    
    console.log(`✅ Found ${topProducts.length} candidate products`);
    
    // 深度匹配分析
    const matchResult = await matchProducts(enterprise, classification, topProducts);
    
    console.log('✅ Match result:', matchResult);
    
    res.status(200).json({
      success: true,
      data: matchResult
    });
  } catch (error) {
    console.error('❌ Match error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Product matching failed'
    });
  }
};

/**
 * 构建搜索查询
 */
function buildSearchQuery(enterprise, classification) {
  const parts = [];
  
  if (classification.推荐需求类型) {
    parts.push(classification.推荐需求类型.join(' '));
  }
  
  if (classification.资产情况) {
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
