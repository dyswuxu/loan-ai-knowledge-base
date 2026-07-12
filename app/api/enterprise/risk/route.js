/**
 * 风控分析 API
 */
import { NextResponse } from 'next/server';
const { analyzeRisk } = require('../../../../lib/enterprise');

export async function POST(request) {
  try {
    const { enterprise, classification } = await request.json();
    
    if (!enterprise) {
      return NextResponse.json({ error: 'Enterprise data is required' }, { status: 400 });
    }

    console.log('🔍 Analyzing risk for enterprise:', enterprise.name || 'Anonymous');
    
    const riskAnalysis = await analyzeRisk(enterprise, classification);
    
    console.log('✅ Risk analysis result:', riskAnalysis);
    
    return NextResponse.json({
      success: true,
      data: riskAnalysis
    });
  } catch (error) {
    console.error('❌ Risk analysis error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Risk analysis failed'
    }, { status: 500 });
  }
}
