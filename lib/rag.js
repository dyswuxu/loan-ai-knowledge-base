/**
 * RAG 检索模块 - 简化版
 * 使用关键词匹配而非向量检索，避免 Embedding API 调用延迟
 */
const fs = require('fs');
const path = require('path');

// 知识库路径
const KB_DIR = path.join(__dirname, '..', 'knowledge-base');

// 缓存知识库数据
let productsCache = null;

/**
 * 加载知识库
 */
function loadKnowledgeBase() {
  if (productsCache) return productsCache;
  
  const kbPath = path.join(KB_DIR, 'loan_products.json');
  const data = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
  productsCache = data.products;
  console.log('📚 Knowledge base loaded:', productsCache.length, 'products');
  return productsCache;
}

/**
 * 搜索相关产品（关键词匹配）
 */
function searchProducts(query, topK = 10) {
  const products = loadKnowledgeBase();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
  
  console.log('🔍 Searching products with query:', query);
  console.log('🔍 Query words:', queryWords);
  
  // 计算每个产品的匹配分数
  const scoredProducts = products.map(product => {
    const productText = buildProductText(product).toLowerCase();
    let score = 0;
    
    for (const word of queryWords) {
      // 检查关键词是否出现在各个字段
      if (product.bank?.toLowerCase().includes(word)) score += 3;
      if (product.product_name?.toLowerCase().includes(word)) score += 3;
      if (product.loan_type?.toLowerCase().includes(word)) score += 2;
      if (product.target?.toLowerCase().includes(word)) score += 2;
      if (product.guarantee_method?.toLowerCase().includes(word)) score += 1;
      if (product.special_conditions?.toLowerCase().includes(word)) score += 1;
      if (productText.includes(word)) score += 0.5;
    }
    
    return { ...product, score };
  });
  
  // 按分数排序
  scoredProducts.sort((a, b) => b.score - a.score);
  
  const results = scoredProducts.slice(0, topK);
  console.log('✅ Found', results.length, 'products, top score:', results[0]?.score);
  
  return results;
}

/**
 * 构建产品文本（用于搜索）
 */
function buildProductText(product) {
  return `
    ${product.bank || ''} ${product.product_name || ''}
    ${product.loan_type || ''}
    ${product.loan_term || ''}
    ${product.interest_rate || ''}
    ${product.loan_amount || ''}
    ${product.guarantee_method || ''}
    ${product.target || ''}
    ${product.asset_liability_ratio || ''}
    ${product.scale_revenue || ''}
    ${product.operation_years || ''}
    ${product.credit_rating || ''}
    ${product.special_conditions || ''}
  `;
}

/**
 * 获取所有产品
 */
function getAllProducts() {
  return loadKnowledgeBase();
}

/**
 * 按银行筛选产品
 */
function getProductsByBank(bank) {
  const products = loadKnowledgeBase();
  return products.filter(p => p.bank === bank);
}

/**
 * 按产品类型筛选
 */
function getProductsByType(loanType) {
  const products = loadKnowledgeBase();
  return products.filter(p => 
    p.loan_type?.includes(loanType) || 
    p.product_name?.includes(loanType)
  );
}

module.exports = {
  searchProducts,
  getAllProducts,
  getProductsByBank,
  getProductsByType,
  buildProductText
};
