/**
 * 企业画像分类 API
 */
import { NextResponse } from 'next/server';
const { classifyEnterprise } = require('../../../../lib/enterprise');

export async function POST(request) {
  try {
    const { enterprise } = await request.json();
    
    if (!enterprise) {
      return NextResponse.json({ error: 'Enterprise data is required' }, { status: 400 });
    }

    console.log('🔍 Classifying enterprise:', enterprise);
    
    const classification = await classifyEnterprise(enterprise);
    
    console.log('✅ Classification result:', classification);
    
    return NextResponse.json({
      success: true,
      data: classification
    });
  } catch (error) {
    console.error('❌ Classification error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Classification failed'
    }, { status: 500 });
  }
}
