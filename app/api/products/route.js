/**
 * 产品列表 API
 */
const { getAllProducts, getProductsByBank, getProductsByType } = require('../../../lib/rag');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bank, type } = req.query;
    
    let products;
    
    if (bank) {
      products = getProductsByBank(bank);
    } else if (type) {
      products = getProductsByType(type);
    } else {
      products = getAllProducts();
    }

    res.status(200).json({
      success: true,
      total: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get products'
    });
  }
};
