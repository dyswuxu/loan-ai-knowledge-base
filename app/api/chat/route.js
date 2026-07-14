import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const KB_DIR = path.join(process.cwd(), 'knowledge-base');

function loadProducts() {
  const kbPath = path.join(KB_DIR, 'loan_products.json');
  const data = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
  return data.products;
}

function searchProducts(query, topK = 10) {
  const products = loadProducts();
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1);
  
  const scoredProducts = products.map(product => {
    const productText = `${product.bank || ''} ${product.product_name || ''} ${product.loan_type || ''} ${product.target || ''} ${product.guarantee_method || ''}`;
    const productTextLower = productText.toLowerCase();
    let score = 0;
    for (const word of queryWords) {
      if (product.bank?.toLowerCase().includes(word)) score += 3;
      if (product.product_name?.toLowerCase().includes(word)) score += 3;
      if (product.loan_type?.toLowerCase().includes(word)) score += 2;
      if (product.target?.toLowerCase().includes(word)) score += 2;
      if (product.guarantee_method?.toLowerCase().includes(word)) score += 1;
      if (productTextLower.includes(word)) score += 0.5;
    }
    return { ...product, score };
  });

  scoredProducts.sort((a, b) => b.score - a.score);
  return scoredProducts.slice(0, topK);
}

export async function POST(request) {
  try {
    const { session_id, message } = await request.json();
    
    const msgLower = message.toLowerCase();

    // 路由判断
    if (msgLower.includes('产品') || msgLower.includes('贷款') || msgLower.includes('银行')) {
      // 产品查询
      const results = searchProducts(message, 5);
      if (results.length > 0) {
        const lines = results.map((p, i) => 
          `${i + 1}. 【${p.bank}】${p.product_name}\n   额度：${p.loan_amount || '-'} | 利率：${p.interest_rate || '-'} | 担保：${p.guarantee_method || '-'}`
        ).join('\n\n');
        return NextResponse.json({
          reply: `为您找到以下匹配的产品：\n\n${lines}\n\n您想了解哪个产品的详细信息？`
        });
      }
      return NextResponse.json({ reply: '抱歉，未找到符合条件的产品。请尝试调整搜索条件。' });
    }

    if (msgLower.includes('分析') || msgLower.includes('风控') || msgLower.includes('风险')) {
      return NextResponse.json({
        reply: `要进行风控分析，请先在「客户管理」中新建客户档案并录入企业信息，然后点击「开始分析」。\n\n或者告诉我：\n• 企业的年营业额\n• 成立年限\n• 行业类型\n• 是否有抵押物\n\n我可以帮您做一个初步评估。`
      });
    }

    if (msgLower.includes('客户') || msgLower.includes('企业')) {
      return NextResponse.json({
        reply: `您可以：\n• 在左侧菜单「客户管理」中新建客户档案\n• 上传营业执照、财务报表等，AI自动解析\n• 录入后进行产品匹配和风控分析\n\n需要我帮您直接开始吗？`
      });
    }

    // 默认回复
    return NextResponse.json({
      reply: `我理解您的问题，但需要更多信息：\n\n• 查询产品：请告诉我企业规模和希望贷款的类型\n• 风控分析：请先在「客户管理」中新建客户\n• 其他问题：请详细描述您的需求\n\n或者试试这些快捷问法：\n• "小微企业有房产能贷多少"\n• "建设银行信用贷产品"\n• "商贸行业适合什么产品"`
    });
  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json({ reply: '抱歉，服务暂时不可用。' }, { status: 500 });
  }
}
