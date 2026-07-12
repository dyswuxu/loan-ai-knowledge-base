/**
 * RAG 检索模块
 */
const fs = require('fs');
const path = require('path');
const { getEmbedding, cosineSimilarity } = require('./minimax');

// 知识库路径
const KB_DIR = path.join(__dirname, '..', 'knowledge-base');

// 缓存知识库数据
let productsCache = null;
let embeddingsCache = {};

/**
 * 加载知识库
 */
function loadKnowledgeBase() {
  if (productsCache) return productsCache;
  
  const kbPath = path.join(KB_DIR, 'loan_products.json');
  const data = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
  productsCache = data.products;
  return productsCache;
}

/**
 * 搜索相关产品（简单关键词匹配 + 向量相似度）
 */
async function searchProducts(query, topK = 5) {
  const products = loadKnowledgeBase();
  
  // 获取查询向量
  const queryEmbedding = await getEmbedding(query);
  
  // 计算每个产品与查询的相似度
  const scoredProducts = [];
  
  for (const product of products) {
    // 构建产品文本用于匹配
    const productText = buildProductText(product);
    
    // 简单的关键词匹配评分
    const keywordScore = calculateKeywordScore(query, product);
    
    // 向量相似度
    let vectorScore = 0;
    const cacheKey = product.product_name;
    if (embeddingsCache[cacheKey]) {
      vectorScore = cosineSimilarity(queryEmbedding, embeddingsCache[cacheKey]);
    } else {
      const productEmbedding = await getEmbedding(productText);
      embeddingsCache[cacheKey] = productEmbedding;
      vectorScore = cosineSimilarity(queryEmbedding, productEmbedding);
    }
    
    // 综合评分
    const combinedScore = keywordScore * 0.4 + vectorScore * 0.6;
    
    scoredProducts.push({
      ...product,
      score: combinedScore,
      keywordScore,
      vectorScore
    });
  }
  
  // 按评分排序，返回topK
  scoredProducts.sort((a, b) => b.score - a.score);
  return scoredProducts.slice(0, topK);
}

/**
 * 构建产品文本
 */
function buildProductText(product) {
  return `
    ${product.bank} ${product.product_name}
    贷款类型: ${product.loan_type}
    贷款期限: ${product.loan_term}
    参考利率: ${product.interest_rate}
    贷款额度: ${product.loan_amount}
    担保方式: ${product.guarantee_method}
    适用对象: ${product.target}
    资产负债率要求: ${product.asset_liability_ratio}
    企业规模/营收要求: ${product.scale_revenue}
    经营年限要求: ${product.operation_years}
    信用评级要求: ${product.credit_rating}
    特殊条件: ${product.special_conditions}
  `.trim();
}

/**
 * 简单关键词匹配评分
 */
function calculateKeywordScore(query, product) {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/);
  
  let score = 0;
  const searchableText = buildProductText(product).toLowerCase();
  
  for (const keyword of keywords) {
    if (searchableText.includes(keyword)) {
      score += 1;
    }
  }
  
  return score / keywords.length;
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
    p.loan_type.includes(loanType) || 
    p.product_name.includes(loanType)
  );
}

module.exports = {
  searchProducts,
  getAllProducts,
  getProductsByBank,
  getProductsByType,
  buildProductText
};
