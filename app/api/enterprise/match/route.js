/**
 * 产品匹配 API
 */
import { NextResponse } from 'next/server';
const { matchProducts } = require('../../../../lib/enterprise');
const { searchProducts } = require('../../../../lib/rag');

export async function POST(request) {
  try {
    const { enterprise, classification, query } = await request.json();
    
    if (!enterprise || !classification) {
      return NextResponse.json({ error: 'Enterprise and classification data are required' }, { status: 400 });
    }

    console.log('🔍 Matching products for enterprise:', enterprise.name || 'Anonymous');

    // 构建查询文本
    const searchQuery = query || buildSearchQuery(enterprise, classification);
    
    // 搜索相关产品
    const topProducts = await searchProducts(searchQuery, 10);
    
    console.log(`✅ Found ${topProducts.length} candidate products`);
    
    // 深度匹配分析
    const matchResult = await matchProducts(enterprise, classification, topProducts);
    
    console.log('✅ Match result:', matchResult);
    
    return NextResponse.json({
      success: true,
      data: matchResult
    });
  } catch (error) {
    console.error('❌ Match error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Product matching failed'
    }, { status: 500 });
  }
}

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
