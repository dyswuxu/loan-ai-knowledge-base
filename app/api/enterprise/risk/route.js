/**
 * 风控分析 API
 */
const { analyzeRisk } = require('../../../lib/enterprise');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { enterprise, classification } = req.body;
    
    if (!enterprise) {
      return res.status(400).json({ error: 'Enterprise data is required' });
    }

    console.log('🔍 Analyzing risk for enterprise:', enterprise.name || 'Anonymous');
    
    const riskAnalysis = await analyzeRisk(enterprise, classification);
    
    console.log('✅ Risk analysis result:', riskAnalysis);
    
    res.status(200).json({
      success: true,
      data: riskAnalysis
    });
  } catch (error) {
    console.error('❌ Risk analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Risk analysis failed'
    });
  }
};
