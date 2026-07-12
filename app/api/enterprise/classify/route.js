/**
 * 企业画像分类 API
 */
const { classifyEnterprise } = require('../../../../lib/enterprise');

module.exports = async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { enterprise } = req.body;
    
    if (!enterprise) {
      return res.status(400).json({ error: 'Enterprise data is required' });
    }

    console.log('🔍 Classifying enterprise:', enterprise);
    
    const classification = await classifyEnterprise(enterprise);
    
    console.log('✅ Classification result:', classification);
    
    res.status(200).json({
      success: true,
      data: classification
    });
  } catch (error) {
    console.error('❌ Classification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Classification failed'
    });
  }
};
